#!/usr/bin/env python3
"""
Calculadora del Equilibrio de Nash para el Índice PANAS
Implementación de la teoría de Nash en economía del poder adquisitivo

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import minimize, differential_evolution
from scipy.stats import entropy
import warnings
warnings.filterwarnings('ignore')

class NashEquilibriumCalculator:
    """
    Calculadora del equilibrio de Nash para optimizar el Índice PANAS
    """
    
    def __init__(self):
        self.n_players = 5  # Número de categorías de bienes
        self.n_strategies = 4  # Número de años de análisis
        
        # Datos históricos normalizados
        self.price_data = {
            'Lipoescultura': [1.0, 1.73, 2.62, 3.17],
            'Consulta_Medica': [1.0, 1.37, 2.01, 2.51],
            'Azucar_kg': [1.0, 1.30, 1.70, 2.40],
            'Gasolina_galon': [1.0, 0.88, 1.12, 1.40],
            'Renta_Mensual': [1.0, 1.50, 2.17, 2.83]
        }
        
        # Matriz de utilidad (años x bienes)
        self.utility_matrix = self._create_utility_matrix()
        
    def _create_utility_matrix(self):
        """
        Crea matriz de utilidad basada en poder adquisitivo
        """
        utility_matrix = np.zeros((self.n_strategies, self.n_players))
        
        for i, year in enumerate([2010, 2015, 2020, 2025]):
            for j, (good, prices) in enumerate(self.price_data.items()):
                # Utilidad = 1 / precio normalizado (mayor precio = menor utilidad)
                utility_matrix[i, j] = 1.0 / prices[i]
        
        # Normalizar por filas (cada año suma 1)
        utility_matrix = utility_matrix / np.sum(utility_matrix, axis=1, keepdims=True)
        
        return utility_matrix
    
    def calculate_pure_strategy_equilibrium(self):
        """
        Calcula el equilibrio de Nash en estrategias puras
        """
        nash_equilibria = []
        
        # Buscar equilibrios de Nash
        for i in range(self.n_strategies):
            for j in range(self.n_players):
                # Verificar si (i, j) es un equilibrio de Nash
                is_equilibrium = True
                
                # Verificar si el jugador 1 no puede mejorar cambiando de estrategia
                for k in range(self.n_strategies):
                    if k != i and self.utility_matrix[k, j] > self.utility_matrix[i, j]:
                        is_equilibrium = False
                        break
                
                # Verificar si el jugador 2 no puede mejorar cambiando de estrategia
                if is_equilibrium:
                    for l in range(self.n_players):
                        if l != j and self.utility_matrix[i, l] > self.utility_matrix[i, j]:
                            is_equilibrium = False
                            break
                
                if is_equilibrium:
                    nash_equilibria.append((i, j, self.utility_matrix[i, j]))
        
        return nash_equilibria
    
    def calculate_mixed_strategy_equilibrium(self):
        """
        Calcula el equilibrio de Nash en estrategias mixtas
        """
        def objective(x):
            # x[0:n_strategies] = probabilidades del jugador 1 (años)
            # x[n_strategies:] = probabilidades del jugador 2 (bienes)
            
            p1 = x[:self.n_strategies]
            p2 = x[self.n_strategies:]
            
            # Normalizar probabilidades
            p1 = p1 / np.sum(p1)
            p2 = p2 / np.sum(p2)
            
            # Calcular utilidad esperada
            expected_utility = np.sum(p1.reshape(-1, 1) * self.utility_matrix * p2.reshape(1, -1))
            
            # Maximizar utilidad (minimizar negativo)
            return -expected_utility
        
        # Restricciones: probabilidades suman 1
        def constraint1(x):
            return np.sum(x[:self.n_strategies]) - 1
        
        def constraint2(x):
            return np.sum(x[self.n_strategies:]) - 1
        
        constraints = [
            {'type': 'eq', 'fun': constraint1},
            {'type': 'eq', 'fun': constraint2}
        ]
        
        # Límites: probabilidades entre 0 y 1
        bounds = [(0, 1) for _ in range(self.n_strategies + self.n_players)]
        
        # Optimización
        result = minimize(objective, 
                         x0=np.ones(self.n_strategies + self.n_players) / (self.n_strategies + self.n_players),
                         method='SLSQP',
                         bounds=bounds,
                         constraints=constraints)
        
        if result.success:
            p1_optimal = result.x[:self.n_strategies] / np.sum(result.x[:self.n_strategies])
            p2_optimal = result.x[self.n_strategies:] / np.sum(result.x[self.n_strategies:])
            return p1_optimal, p2_optimal, -result.fun
        else:
            return None, None, None
    
    def calculate_panas_optimal_weights(self):
        """
        Calcula los pesos óptimos para el Índice PANAS usando Nash
        """
        def objective(weights):
            # Normalizar pesos
            weights = weights / np.sum(weights)
            
            # Calcular índice PANAS para cada año
            panas_indices = []
            for i in range(self.n_strategies):
                panas_index = np.sum(weights * self.utility_matrix[i, :])
                panas_indices.append(panas_index)
            
            # Minimizar varianza (maximizar estabilidad)
            variance = np.var(panas_indices)
            
            # Maximizar crecimiento promedio
            growth = np.mean(panas_indices)
            
            # Función objetivo: minimizar varianza, maximizar crecimiento
            return variance - 0.1 * growth
        
        # Restricciones: pesos suman 1
        constraints = {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}
        bounds = [(0, 1) for _ in range(self.n_players)]
        
        # Optimización
        result = minimize(objective, 
                         x0=np.ones(self.n_players) / self.n_players,
                         method='SLSQP',
                         bounds=bounds,
                         constraints=constraints)
        
        if result.success:
            optimal_weights = result.x / np.sum(result.x)
            return optimal_weights
        else:
            return None
    
    def calculate_shapley_value(self):
        """
        Calcula el valor de Shapley para cada bien en la coalición
        """
        shapley_values = np.zeros(self.n_players)
        
        # Calcular valor de Shapley para cada bien
        for i in range(self.n_players):
            shapley_value = 0
            
            # Sumar sobre todas las coaliciones que no contienen i
            for S in range(2 ** (self.n_players - 1)):
                # Reconstruir coalición original
                coalition = []
                temp_S = S
                for j in range(self.n_players):
                    if j != i:
                        if temp_S % 2 == 1:
                            coalition.append(j)
                        temp_S //= 2
                
                # Calcular contribución marginal
                coalition_with_i = coalition + [i]
                coalition_without_i = coalition
                
                # Valor de la coalición con i
                value_with = self._calculate_coalition_value(coalition_with_i)
                value_without = self._calculate_coalition_value(coalition_without_i)
                
                marginal_contribution = value_with - value_without
                
                # Peso de la coalición
                s = len(coalition)
                weight = 1.0 / (self.n_players * self._binomial_coefficient(self.n_players - 1, s))
                
                shapley_value += weight * marginal_contribution
            
            shapley_values[i] = shapley_value
        
        return shapley_values
    
    def _calculate_coalition_value(self, coalition):
        """
        Calcula el valor de una coalición de bienes
        """
        if not coalition:
            return 0
        
        # Calcular utilidad promedio de la coalición
        coalition_utility = np.mean(self.utility_matrix[:, coalition], axis=1)
        
        # Valor = utilidad promedio ponderada por estabilidad
        stability = 1.0 / (1.0 + np.var(coalition_utility))
        return np.mean(coalition_utility) * stability
    
    def _binomial_coefficient(self, n, k):
        """
        Calcula el coeficiente binomial C(n, k)
        """
        if k > n or k < 0:
            return 0
        if k == 0 or k == n:
            return 1
        
        result = 1
        for i in range(min(k, n - k)):
            result = result * (n - i) // (i + 1)
        
        return result
    
    def plot_nash_equilibrium(self):
        """
        Visualiza el equilibrio de Nash
        """
        # Calcular equilibrios
        pure_equilibria = self.calculate_pure_strategy_equilibrium()
        mixed_p1, mixed_p2, mixed_utility = self.calculate_mixed_strategy_equilibrium()
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Análisis del Equilibrio de Nash - Índice PANAS', fontsize=16, fontweight='bold')
        
        # Gráfico 1: Matriz de utilidad
        ax1 = axes[0, 0]
        im = ax1.imshow(self.utility_matrix, cmap='viridis', aspect='auto')
        ax1.set_title('Matriz de Utilidad', fontsize=14)
        ax1.set_xlabel('Bienes')
        ax1.set_ylabel('Años')
        ax1.set_xticks(range(self.n_players))
        ax1.set_xticklabels(list(self.price_data.keys()), rotation=45)
        ax1.set_yticks(range(self.n_strategies))
        ax1.set_yticklabels(['2010', '2015', '2020', '2025'])
        plt.colorbar(im, ax=ax1)
        
        # Marcar equilibrios puros
        for eq in pure_equilibria:
            ax1.plot(eq[1], eq[0], 'ro', markersize=10, markeredgecolor='white', markeredgewidth=2)
        
        # Gráfico 2: Estrategias mixtas del jugador 1 (años)
        ax2 = axes[0, 1]
        if mixed_p1 is not None:
            years = ['2010', '2015', '2020', '2025']
            ax2.bar(years, mixed_p1, color='skyblue', alpha=0.7)
            ax2.set_title('Estrategias Mixtas - Años', fontsize=14)
            ax2.set_ylabel('Probabilidad')
            ax2.set_ylim(0, 1)
        
        # Gráfico 3: Estrategias mixtas del jugador 2 (bienes)
        ax3 = axes[1, 0]
        if mixed_p2 is not None:
            goods = list(self.price_data.keys())
            ax3.bar(goods, mixed_p2, color='lightcoral', alpha=0.7)
            ax3.set_title('Estrategias Mixtas - Bienes', fontsize=14)
            ax3.set_ylabel('Probabilidad')
            ax3.set_ylim(0, 1)
            ax3.tick_params(axis='x', rotation=45)
        
        # Gráfico 4: Valor de Shapley
        ax4 = axes[1, 1]
        shapley_values = self.calculate_shapley_value()
        goods = list(self.price_data.keys())
        ax4.bar(goods, shapley_values, color='lightgreen', alpha=0.7)
        ax4.set_title('Valor de Shapley', fontsize=14)
        ax4.set_ylabel('Valor')
        ax4.tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        plt.savefig('nash_equilibrium_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def generate_nash_report(self):
        """
        Genera reporte del análisis de Nash
        """
        print("=" * 80)
        print("ANÁLISIS DEL EQUILIBRIO DE NASH - ÍNDICE PANAS")
        print("=" * 80)
        
        # Equilibrios puros
        pure_equilibria = self.calculate_pure_strategy_equilibrium()
        print(f"\n🎯 EQUILIBRIOS PUROS ENCONTRADOS: {len(pure_equilibria)}")
        print("-" * 50)
        
        for i, eq in enumerate(pure_equilibria):
            year = ['2010', '2015', '2020', '2025'][eq[0]]
            good = list(self.price_data.keys())[eq[1]]
            utility = eq[2]
            print(f"  {i+1}. Año: {year}, Bien: {good}, Utilidad: {utility:.4f}")
        
        # Equilibrio mixto
        mixed_p1, mixed_p2, mixed_utility = self.calculate_mixed_strategy_equilibrium()
        print(f"\n🎲 EQUILIBRIO MIXTO:")
        print("-" * 30)
        
        if mixed_p1 is not None:
            print("  Probabilidades por Año:")
            years = ['2010', '2015', '2020', '2025']
            for year, prob in zip(years, mixed_p1):
                print(f"    {year}: {prob:.4f}")
            
            print("\n  Probabilidades por Bien:")
            goods = list(self.price_data.keys())
            for good, prob in zip(goods, mixed_p2):
                print(f"    {good}: {prob:.4f}")
            
            print(f"\n  Utilidad Esperada: {mixed_utility:.4f}")
        
        # Pesos óptimos PANAS
        optimal_weights = self.calculate_panas_optimal_weights()
        print(f"\n⚖️ PESOS ÓPTIMOS PANAS (NASH):")
        print("-" * 40)
        
        if optimal_weights is not None:
            goods = list(self.price_data.keys())
            for good, weight in zip(goods, optimal_weights):
                print(f"  {good:<20}: {weight:.4f}")
        
        # Valor de Shapley
        shapley_values = self.calculate_shapley_value()
        print(f"\n🔢 VALOR DE SHAPLEY:")
        print("-" * 30)
        
        goods = list(self.price_data.keys())
        for good, value in zip(goods, shapley_values):
            print(f"  {good:<20}: {value:.4f}")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES NASH:")
        print("-" * 40)
        print("1. El equilibrio mixto optimiza la utilidad esperada")
        print("2. Los pesos óptimos minimizan la varianza del índice")
        print("3. El valor de Shapley indica la contribución de cada bien")
        print("4. La diversificación reduce el riesgo sistémico")
        
        return {
            'pure_equilibria': pure_equilibria,
            'mixed_equilibrium': (mixed_p1, mixed_p2, mixed_utility),
            'optimal_weights': optimal_weights,
            'shapley_values': shapley_values
        }

def main():
    """
    Función principal
    """
    # Crear calculadora
    calculator = NashEquilibriumCalculator()
    
    # Generar reporte
    results = calculator.generate_nash_report()
    
    # Crear gráficos
    print("\n📈 Generando gráficos del equilibrio de Nash...")
    calculator.plot_nash_equilibrium()
    
    print("\n✅ Análisis de Nash completado. Gráficos guardados como PNG.")

if __name__ == "__main__":
    main()
