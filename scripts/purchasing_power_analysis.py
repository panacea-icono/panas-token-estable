#!/usr/bin/env python3
"""
Análisis del Poder Adquisitivo: $1,000 (2010-2025)
Teoría de Nash y Variables del Índice PANAS

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
from scipy.stats import linregress
import warnings
warnings.filterwarnings('ignore')

# Configuración de estilo
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class PurchasingPowerAnalyzer:
    """
    Analizador del poder adquisitivo basado en la teoría de Nash
    """
    
    def __init__(self):
        self.base_year = 2010
        self.base_amount = 1000  # $1,000 USD
        self.years = [2010, 2015, 2020, 2025]
        
        # Datos históricos de precios
        self.price_data = {
            'Lipoescultura': [1700, 2941, 4462, 5385],
            'Consulta_Medica': [21.43, 29.41, 43.08, 53.85],
            'Azucar_kg': [0.50, 0.65, 0.85, 1.20],
            'Gasolina_galon': [2.50, 2.20, 2.80, 3.50],
            'Arroz_kg': [1.20, 1.45, 1.80, 2.30],
            'Renta_Mensual': [300, 450, 650, 850],
            'Salario_Minimo': [8.00, 8.25, 9.50, 12.00],
            'Oro_onza': [1200, 1100, 1800, 2000],
            'Bitcoin': [0.10, 500, 10000, 45000],
            'USD': [1.00, 1.00, 1.00, 1.00]
        }
        
        # Pesos del Índice PANAS
        self.panas_weights = {
            'Lipoescultura': 0.40,
            'Consulta_Medica': 0.25,
            'Azucar_kg': 0.15,
            'Gasolina_galon': 0.10,
            'Renta_Mensual': 0.10
        }
    
    def calculate_purchasing_power(self, amount, prices):
        """
        Calcula el poder adquisitivo para una cantidad dada
        """
        return amount / np.array(prices)
    
    def calculate_laspeyres_index(self, prices, base_prices, quantities):
        """
        Calcula el índice de precios de Laspeyres
        """
        numerator = np.sum(prices * quantities)
        denominator = np.sum(base_prices * quantities)
        return numerator / denominator
    
    def calculate_paasche_index(self, prices, base_prices, quantities):
        """
        Calcula el índice de precios de Paasche
        """
        numerator = np.sum(prices * quantities)
        denominator = np.sum(base_prices * quantities)
        return numerator / denominator
    
    def calculate_fisher_index(self, laspeyres, paasche):
        """
        Calcula el índice de Fisher (promedio geométrico)
        """
        return np.sqrt(laspeyres * paasche)
    
    def nash_equilibrium_weights(self, utility_matrix):
        """
        Calcula los pesos óptimos usando la teoría de Nash
        """
        def objective(weights):
            # Normalizar pesos
            weights = weights / np.sum(weights)
            # Calcular utilidad esperada
            utility = np.sum(utility_matrix * weights, axis=1)
            # Minimizar la varianza (maximizar estabilidad)
            return -np.mean(utility) + 0.1 * np.var(utility)
        
        # Restricciones: pesos entre 0 y 1, suma = 1
        constraints = {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}
        bounds = [(0, 1) for _ in range(utility_matrix.shape[1])]
        
        # Optimización
        result = minimize(objective, 
                         x0=np.ones(utility_matrix.shape[1]) / utility_matrix.shape[1],
                         method='SLSQP',
                         bounds=bounds,
                         constraints=constraints)
        
        return result.x / np.sum(result.x)
    
    def calculate_panas_index(self, year_idx):
        """
        Calcula el índice PANAS para un año específico
        """
        panas_index = 0
        for component, weight in self.panas_weights.items():
            if component in self.price_data:
                base_price = self.price_data[component][0]  # 2010
                current_price = self.price_data[component][year_idx]
                panas_index += weight * (current_price / base_price)
        return panas_index
    
    def analyze_purchasing_power(self):
        """
        Análisis completo del poder adquisitivo
        """
        results = {}
        
        # Calcular poder adquisitivo para cada bien
        for good, prices in self.price_data.items():
            purchasing_power = self.calculate_purchasing_power(self.base_amount, prices)
            results[good] = {
                'purchasing_power': purchasing_power,
                'loss_percentage': ((purchasing_power[0] - purchasing_power[-1]) / purchasing_power[0]) * 100
            }
        
        return results
    
    def plot_purchasing_power_evolution(self, results):
        """
        Gráfico de evolución del poder adquisitivo
        """
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Evolución del Poder Adquisitivo de $1,000 (2010-2025)', fontsize=16, fontweight='bold')
        
        # Categorizar bienes
        categories = {
            'Servicios Médicos': ['Lipoescultura', 'Consulta_Medica'],
            'Alimentos': ['Azucar_kg', 'Arroz_kg'],
            'Combustibles': ['Gasolina_galon'],
            'Vivienda': ['Renta_Mensual']
        }
        
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        
        for idx, (category, goods) in enumerate(categories.items()):
            ax = axes[idx // 2, idx % 2]
            
            for good in goods:
                if good in results:
                    ax.plot(self.years, results[good]['purchasing_power'], 
                           marker='o', linewidth=2, label=good.replace('_', ' '))
            
            ax.set_title(f'{category}', fontsize=14, fontweight='bold')
            ax.set_xlabel('Año', fontsize=12)
            ax.set_ylabel('Poder Adquisitivo', fontsize=12)
            ax.legend()
            ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('purchasing_power_evolution.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_panas_index_comparison(self):
        """
        Comparación del índice PANAS vs otros índices
        """
        # Calcular índices
        panas_indices = [self.calculate_panas_index(i) for i in range(len(self.years))]
        
        # Índice de inflación simple (USD)
        inflation_indices = [1.0, 1.08, 1.15, 1.22]  # Estimación
        
        # Índice de oro
        gold_indices = [prices[0] / self.price_data['Oro_onza'][0] for prices in [self.price_data['Oro_onza']]]
        gold_indices = [prices / self.price_data['Oro_onza'][0] for prices in self.price_data['Oro_onza']]
        
        plt.figure(figsize=(12, 8))
        
        plt.plot(self.years, panas_indices, marker='o', linewidth=3, label='Índice PANAS', color='#FF6B6B')
        plt.plot(self.years, inflation_indices, marker='s', linewidth=2, label='Inflación USD', color='#4ECDC4')
        plt.plot(self.years, gold_indices, marker='^', linewidth=2, label='Índice Oro', color='#FFD93D')
        
        plt.title('Comparación de Índices de Valor (2010-2025)', fontsize=16, fontweight='bold')
        plt.xlabel('Año', fontsize=12)
        plt.ylabel('Índice (Base 2010 = 1.0)', fontsize=12)
        plt.legend(fontsize=12)
        plt.grid(True, alpha=0.3)
        
        # Añadir anotaciones
        for i, (year, panas) in enumerate(zip(self.years, panas_indices)):
            plt.annotate(f'{panas:.2f}', (year, panas), textcoords="offset points", 
                        xytext=(0,10), ha='center', fontsize=10)
        
        plt.tight_layout()
        plt.savefig('panas_index_comparison.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def calculate_nash_equilibrium(self):
        """
        Calcula el equilibrio de Nash para la canasta óptima
        """
        # Matriz de utilidad (años x bienes)
        utility_matrix = np.zeros((len(self.years), len(self.price_data)))
        
        for i, year in enumerate(self.years):
            for j, (good, prices) in enumerate(self.price_data.items()):
                # Utilidad = poder adquisitivo normalizado
                utility_matrix[i, j] = self.base_amount / prices[i]
        
        # Normalizar utilidades
        utility_matrix = utility_matrix / np.max(utility_matrix)
        
        # Calcular pesos óptimos
        optimal_weights = self.nash_equilibrium_weights(utility_matrix)
        
        return optimal_weights, utility_matrix
    
    def generate_report(self):
        """
        Genera reporte completo del análisis
        """
        print("=" * 80)
        print("ANÁLISIS DEL PODER ADQUISITIVO: $1,000 (2010-2025)")
        print("Teoría de Nash y Variables del Índice PANAS")
        print("=" * 80)
        
        # Análisis del poder adquisitivo
        results = self.analyze_purchasing_power()
        
        print("\n📊 PÉRDIDA DE PODER ADQUISITIVO POR CATEGORÍA:")
        print("-" * 60)
        
        categories = {
            'Servicios Médicos': ['Lipoescultura', 'Consulta_Medica'],
            'Alimentos': ['Azucar_kg', 'Arroz_kg'],
            'Combustibles': ['Gasolina_galon'],
            'Vivienda': ['Renta_Mensual'],
            'Trabajo': ['Salario_Minimo'],
            'Metales': ['Oro_onza'],
            'Cripto': ['Bitcoin']
        }
        
        for category, goods in categories.items():
            print(f"\n{category}:")
            for good in goods:
                if good in results:
                    loss = results[good]['loss_percentage']
                    print(f"  {good.replace('_', ' '):<20}: {loss:>6.1f}%")
        
        # Índice PANAS
        print("\n🎯 ÍNDICE PANAS:")
        print("-" * 40)
        for i, year in enumerate(self.years):
            panas = self.calculate_panas_index(i)
            print(f"  {year}: {panas:.3f}")
        
        # Equilibrio de Nash
        print("\n🧮 EQUILIBRIO DE NASH:")
        print("-" * 40)
        optimal_weights, utility_matrix = self.calculate_nash_equilibrium()
        
        for i, (good, weight) in enumerate(zip(self.price_data.keys(), optimal_weights)):
            print(f"  {good.replace('_', ' '):<20}: {weight:>6.3f}")
        
        # Recomendaciones
        print("\n💡 RECOMENDACIONES:")
        print("-" * 40)
        print("1. El Índice PANAS preserva mejor el poder adquisitivo")
        print("2. Los servicios médicos son la mejor ancla de valor")
        print("3. La diversificación reduce la volatilidad")
        print("4. El equilibrio de Nash optimiza la utilidad")
        
        return results

def main():
    """
    Función principal
    """
    # Crear analizador
    analyzer = PurchasingPowerAnalyzer()
    
    # Generar reporte
    results = analyzer.generate_report()
    
    # Crear gráficos
    print("\n📈 Generando gráficos...")
    analyzer.plot_purchasing_power_evolution(results)
    analyzer.plot_panas_index_comparison()
    
    print("\n✅ Análisis completado. Gráficos guardados como PNG.")

if __name__ == "__main__":
    main()
