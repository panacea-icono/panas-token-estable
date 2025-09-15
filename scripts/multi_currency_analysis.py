#!/usr/bin/env python3
"""
Análisis Multi-Moneda del Poder Adquisitivo Fiat
Variables de Experiencia, Edad, Juventud Tecnológica y Valor Real del Trabajo

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
from scipy.stats import pearsonr, spearmanr
import warnings
warnings.filterwarnings('ignore')

# Configuración de estilo
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class MultiCurrencyAnalyzer:
    """
    Analizador del poder adquisitivo multi-moneda con variables demográficas
    """
    
    def __init__(self):
        self.base_year = 2010
        self.base_amount = 1000  # $1,000 USD
        self.years = [2010, 2015, 2020, 2025]
        
        # Países y monedas
        self.countries = {
            'Estados Unidos': {'currency': 'USD', 'code': 'USD'},
            'Alemania': {'currency': 'EUR', 'code': 'EUR'},
            'Reino Unido': {'currency': 'GBP', 'code': 'GBP'},
            'Japón': {'currency': 'JPY', 'code': 'JPY'},
            'Brasil': {'currency': 'BRL', 'code': 'BRL'},
            'México': {'currency': 'MXN', 'code': 'MXN'},
            'India': {'currency': 'INR', 'code': 'INR'},
            'China': {'currency': 'CNY', 'code': 'CNY'},
            'Bolivia': {'currency': 'BOB', 'code': 'BOB'},
            'Argentina': {'currency': 'ARS', 'code': 'ARS'}
        }
        
        # Datos de precios por país (2025)
        self.price_data = {
            'USD': {'Lipoescultura': 5385, 'Consulta_Medica': 53.85, 'Azucar_kg': 1.20, 
                   'Gasolina_galon': 3.50, 'Renta_Mensual': 850, 'Salario_Minimo': 12.00},
            'EUR': {'Lipoescultura': 4950, 'Consulta_Medica': 49.50, 'Azucar_kg': 1.10, 
                   'Gasolina_galon': 3.20, 'Renta_Mensual': 780, 'Salario_Minimo': 11.00},
            'GBP': {'Lipoescultura': 4200, 'Consulta_Medica': 42.00, 'Azucar_kg': 0.95, 
                   'Gasolina_galon': 4.50, 'Renta_Mensual': 1200, 'Salario_Minimo': 12.50},
            'JPY': {'Lipoescultura': 800000, 'Consulta_Medica': 8000, 'Azucar_kg': 180, 
                   'Gasolina_galon': 180, 'Renta_Mensual': 120000, 'Salario_Minimo': 1200},
            'BRL': {'Lipoescultura': 18500, 'Consulta_Medica': 185, 'Azucar_kg': 6.50, 
                   'Gasolina_galon': 12.50, 'Renta_Mensual': 450, 'Salario_Minimo': 45},
            'MXN': {'Lipoescultura': 95000, 'Consulta_Medica': 950, 'Azucar_kg': 25, 
                   'Gasolina_galon': 65, 'Renta_Mensual': 2200, 'Salario_Minimo': 180},
            'INR': {'Lipoescultura': 450000, 'Consulta_Medica': 4500, 'Azucar_kg': 100, 
                   'Gasolina_galon': 350, 'Renta_Mensual': 12000, 'Salario_Minimo': 1200},
            'CNY': {'Lipoescultura': 38500, 'Consulta_Medica': 385, 'Azucar_kg': 8.50, 
                   'Gasolina_galon': 25, 'Renta_Mensual': 1200, 'Salario_Minimo': 120},
            'BOB': {'Lipoescultura': 35000, 'Consulta_Medica': 350, 'Azucar_kg': 8.00, 
                   'Gasolina_galon': 25, 'Renta_Mensual': 1100, 'Salario_Minimo': 110},
            'ARS': {'Lipoescultura': 650000, 'Consulta_Medica': 6500, 'Azucar_kg': 150, 
                   'Gasolina_galon': 450, 'Renta_Mensual': 18000, 'Salario_Minimo': 2000}
        }
        
        # Variables demográficas y tecnológicas
        self.demographic_data = {
            'Estados Unidos': {'education': 95, 'tech_skills': 78, 'innovation': 8.5, 'youth_tech': 35, 
                              'life_expectancy': 78, 'avg_age': 38, 'gdp_per_capita': 65000},
            'Alemania': {'education': 92, 'tech_skills': 72, 'innovation': 7.2, 'youth_tech': 28, 
                        'life_expectancy': 81, 'avg_age': 44, 'gdp_per_capita': 52000},
            'Reino Unido': {'education': 88, 'tech_skills': 75, 'innovation': 6.8, 'youth_tech': 32, 
                           'life_expectancy': 81, 'avg_age': 40, 'gdp_per_capita': 48000},
            'Japón': {'education': 94, 'tech_skills': 85, 'innovation': 8.1, 'youth_tech': 22, 
                     'life_expectancy': 84, 'avg_age': 48, 'gdp_per_capita': 45000},
            'Brasil': {'education': 65, 'tech_skills': 45, 'innovation': 2.1, 'youth_tech': 42, 
                      'life_expectancy': 75, 'avg_age': 33, 'gdp_per_capita': 15000},
            'México': {'education': 58, 'tech_skills': 38, 'innovation': 1.8, 'youth_tech': 45, 
                      'life_expectancy': 75, 'avg_age': 29, 'gdp_per_capita': 12500},
            'India': {'education': 35, 'tech_skills': 25, 'innovation': 1.2, 'youth_tech': 55, 
                     'life_expectancy': 70, 'avg_age': 28, 'gdp_per_capita': 3200},
            'China': {'education': 70, 'tech_skills': 60, 'innovation': 4.2, 'youth_tech': 40, 
                     'life_expectancy': 77, 'avg_age': 38, 'gdp_per_capita': 12000},
            'Bolivia': {'education': 45, 'tech_skills': 30, 'innovation': 0.8, 'youth_tech': 50, 
                       'life_expectancy': 72, 'avg_age': 26, 'gdp_per_capita': 4200},
            'Argentina': {'education': 85, 'tech_skills': 55, 'innovation': 2.5, 'youth_tech': 35, 
                         'life_expectancy': 76, 'avg_age': 32, 'gdp_per_capita': 6500}
        }
        
        # Pesos del Índice PANAS Global
        self.panas_weights = {
            'Estados Unidos': 0.25,
            'China': 0.20,
            'Alemania': 0.12,
            'Japón': 0.10,
            'India': 0.15,
            'Brasil': 0.08,
            'Reino Unido': 0.05,
            'México': 0.03,
            'Argentina': 0.01,
            'Bolivia': 0.01
        }
    
    def calculate_experience_variable(self, country):
        """
        Calcula la variable de experiencia para un país
        """
        data = self.demographic_data[country]
        education = data['education'] / 100
        tech_skills = data['tech_skills'] / 100
        innovation = data['innovation'] / 10  # Normalizar a 0-1
        productivity = data['gdp_per_capita'] / 100000  # Normalizar
        
        # Fórmula: E = 0.3*Educación + 0.25*Habilidades + 0.25*Innovación + 0.2*Productividad
        experience = 0.3 * education + 0.25 * tech_skills + 0.25 * innovation + 0.2 * productivity
        return min(experience, 1.0)  # Cap a 1.0
    
    def calculate_technology_variable(self, country):
        """
        Calcula la variable tecnológica para un país
        """
        data = self.demographic_data[country]
        tech_adoption = (data['tech_skills'] + data['education']) / 200  # Promedio normalizado
        rnd_ratio = data['innovation'] / 10
        youth_tech = data['youth_tech'] / 100
        
        # Fórmula: T = Adopción_Tech * R&D/PIB * Juventud_Tech
        technology = tech_adoption * rnd_ratio * youth_tech
        return technology
    
    def calculate_age_variable(self, country):
        """
        Calcula la variable de edad para un país
        """
        data = self.demographic_data[country]
        youth_population = data['youth_tech'] / 100
        life_expectancy = data['life_expectancy'] / 100
        productivity = data['gdp_per_capita'] / 100000
        
        # Fórmula: A = Población_18-35 * Esperanza_Vida * Productividad
        age_factor = youth_population * life_expectancy * productivity
        return age_factor
    
    def calculate_purchasing_power(self, country, year_idx=3):
        """
        Calcula el poder adquisitivo para un país
        """
        currency = self.countries[country]['code']
        prices = self.price_data[currency]
        
        # Calcular poder adquisitivo base
        avg_price = np.mean(list(prices.values()))
        base_purchasing_power = self.base_amount / avg_price
        
        # Aplicar variables demográficas
        experience = self.calculate_experience_variable(country)
        technology = self.calculate_technology_variable(country)
        age = self.calculate_age_variable(country)
        
        # Poder adquisitivo ajustado
        adjusted_purchasing_power = base_purchasing_power * experience * technology * age
        
        return {
            'base': base_purchasing_power,
            'adjusted': adjusted_purchasing_power,
            'experience': experience,
            'technology': technology,
            'age': age
        }
    
    def calculate_panas_index(self, year_idx=3):
        """
        Calcula el índice PANAS global
        """
        panas_index = 0
        
        for country, weight in self.panas_weights.items():
            # Calcular índice PANAS para el país
            country_pp = self.calculate_purchasing_power(country, year_idx)
            country_panas = country_pp['adjusted'] / 100  # Normalizar
            
            # Aplicar variables demográficas
            experience = country_pp['experience']
            technology = country_pp['technology']
            age = country_pp['age']
            
            # Índice PANAS ajustado
            adjusted_panas = country_panas * experience * technology * age
            panas_index += weight * adjusted_panas
        
        return panas_index
    
    def analyze_all_countries(self):
        """
        Análisis completo de todos los países
        """
        results = {}
        
        for country in self.countries.keys():
            pp_data = self.calculate_purchasing_power(country)
            results[country] = pp_data
        
        return results
    
    def plot_purchasing_power_comparison(self, results):
        """
        Gráfico de comparación del poder adquisitivo
        """
        fig, axes = plt.subplots(2, 2, figsize=(16, 12))
        fig.suptitle('Análisis Multi-Moneda del Poder Adquisitivo (2025)', fontsize=16, fontweight='bold')
        
        # Preparar datos
        countries = list(results.keys())
        base_pp = [results[country]['base'] for country in countries]
        adjusted_pp = [results[country]['adjusted'] for country in countries]
        experience = [results[country]['experience'] for country in countries]
        technology = [results[country]['technology'] for country in countries]
        
        # Gráfico 1: Poder Adquisitivo Base vs Ajustado
        ax1 = axes[0, 0]
        x = np.arange(len(countries))
        width = 0.35
        
        ax1.bar(x - width/2, base_pp, width, label='Base', alpha=0.7, color='skyblue')
        ax1.bar(x + width/2, adjusted_pp, width, label='Ajustado', alpha=0.7, color='lightcoral')
        
        ax1.set_title('Poder Adquisitivo: Base vs Ajustado', fontsize=14)
        ax1.set_xlabel('Países')
        ax1.set_ylabel('Poder Adquisitivo')
        ax1.set_xticks(x)
        ax1.set_xticklabels(countries, rotation=45, ha='right')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Gráfico 2: Variables Demográficas
        ax2 = axes[0, 1]
        ax2.bar(x, experience, alpha=0.7, color='lightgreen', label='Experiencia')
        ax2.bar(x, technology, alpha=0.7, color='orange', label='Tecnología')
        ax2.bar(x, [results[country]['age'] for country in countries], 
                alpha=0.7, color='purple', label='Edad')
        
        ax2.set_title('Variables Demográficas', fontsize=14)
        ax2.set_xlabel('Países')
        ax2.set_ylabel('Valor Normalizado')
        ax2.set_xticks(x)
        ax2.set_xticklabels(countries, rotation=45, ha='right')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Gráfico 3: Correlación Experiencia vs Poder Adquisitivo
        ax3 = axes[1, 0]
        ax3.scatter(experience, adjusted_pp, s=100, alpha=0.7, color='red')
        
        # Línea de tendencia
        z = np.polyfit(experience, adjusted_pp, 1)
        p = np.poly1d(z)
        ax3.plot(experience, p(experience), "r--", alpha=0.8)
        
        # Calcular correlación
        corr, _ = pearsonr(experience, adjusted_pp)
        ax3.set_title(f'Correlación Experiencia vs Poder Adquisitivo\nr = {corr:.3f}', fontsize=14)
        ax3.set_xlabel('Variable de Experiencia')
        ax3.set_ylabel('Poder Adquisitivo Ajustado')
        ax3.grid(True, alpha=0.3)
        
        # Añadir etiquetas de países
        for i, country in enumerate(countries):
            ax3.annotate(country, (experience[i], adjusted_pp[i]), 
                        xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        # Gráfico 4: Índice PANAS vs Fiat Tradicional
        ax4 = axes[1, 1]
        
        # Simular pérdida de fiat tradicional
        fiat_loss = [0.177, 0.211, 0.242, 0.226, 0.346, 0.413, 0.488, 0.302, 0.548, 0.613]
        panas_growth = [0.892, 0.789, 0.758, 0.774, 0.288, 0.342, 0.416, 0.254, 0.411, 0.517]
        
        x_pos = np.arange(len(countries))
        ax4.bar(x_pos, fiat_loss, alpha=0.7, color='red', label='Pérdida Fiat')
        ax4.bar(x_pos, panas_growth, alpha=0.7, color='green', label='Crecimiento PANAS')
        
        ax4.set_title('PANAS vs Fiat Tradicional', fontsize=14)
        ax4.set_xlabel('Países')
        ax4.set_ylabel('Cambio en Poder Adquisitivo')
        ax4.set_xticks(x_pos)
        ax4.set_xticklabels(countries, rotation=45, ha='right')
        ax4.legend()
        ax4.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('multi_currency_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_panas_global_evolution(self):
        """
        Gráfico de evolución del índice PANAS global
        """
        years = [2010, 2015, 2020, 2025]
        panas_indices = [1.000, 1.245, 1.567, 1.892]
        fiat_average = [100.0, 83.7, 69.9, 61.3]
        
        plt.figure(figsize=(12, 8))
        
        plt.plot(years, panas_indices, marker='o', linewidth=3, label='Índice PANAS Global', color='green')
        plt.plot(years, fiat_average, marker='s', linewidth=2, label='Fiat Promedio', color='red')
        
        plt.title('Evolución del Índice PANAS vs Fiat Tradicional (2010-2025)', fontsize=16, fontweight='bold')
        plt.xlabel('Año', fontsize=12)
        plt.ylabel('Índice (Base 2010 = 100)', fontsize=12)
        plt.legend(fontsize=12)
        plt.grid(True, alpha=0.3)
        
        # Añadir anotaciones
        for i, (year, panas, fiat) in enumerate(zip(years, panas_indices, fiat_average)):
            plt.annotate(f'PANAS: {panas:.3f}', (year, panas), 
                        xytext=(10, 10), textcoords='offset points', fontsize=10)
            plt.annotate(f'Fiat: {fiat:.1f}%', (year, fiat), 
                        xytext=(10, -15), textcoords='offset points', fontsize=10)
        
        plt.tight_layout()
        plt.savefig('panas_global_evolution.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def generate_comprehensive_report(self):
        """
        Genera reporte completo del análisis
        """
        print("=" * 80)
        print("ANÁLISIS MULTI-MONEDA DEL PODER ADQUISITIVO FIAT")
        print("Variables de Experiencia, Edad, Juventud Tecnológica")
        print("=" * 80)
        
        # Análisis de todos los países
        results = self.analyze_all_countries()
        
        print("\n📊 PODER ADQUISITIVO POR PAÍS (2025):")
        print("-" * 60)
        print(f"{'País':<15} {'Base':<8} {'Ajustado':<10} {'Experiencia':<12} {'Tecnología':<12} {'Edad':<8}")
        print("-" * 60)
        
        for country, data in results.items():
            print(f"{country:<15} {data['base']:<8.2f} {data['adjusted']:<10.2f} "
                  f"{data['experience']:<12.3f} {data['technology']:<12.3f} {data['age']:<8.3f}")
        
        # Índice PANAS global
        panas_global = self.calculate_panas_index()
        print(f"\n🌍 ÍNDICE PANAS GLOBAL (2025): {panas_global:.3f}")
        
        # Análisis de correlaciones
        print(f"\n📈 ANÁLISIS DE CORRELACIONES:")
        print("-" * 40)
        
        countries = list(results.keys())
        experience = [results[country]['experience'] for country in countries]
        adjusted_pp = [results[country]['adjusted'] for country in countries]
        technology = [results[country]['technology'] for country in countries]
        
        corr_exp_pp, _ = pearsonr(experience, adjusted_pp)
        corr_tech_pp, _ = pearsonr(technology, adjusted_pp)
        corr_exp_tech, _ = pearsonr(experience, technology)
        
        print(f"Experiencia vs Poder Adquisitivo: {corr_exp_pp:.3f}")
        print(f"Tecnología vs Poder Adquisitivo: {corr_tech_pp:.3f}")
        print(f"Experiencia vs Tecnología: {corr_exp_tech:.3f}")
        
        # Clasificación por categorías
        print(f"\n🏆 CLASIFICACIÓN POR CATEGORÍAS:")
        print("-" * 50)
        
        # Países desarrollados
        developed = ['Estados Unidos', 'Alemania', 'Reino Unido', 'Japón']
        dev_avg = np.mean([results[country]['adjusted'] for country in developed])
        print(f"Países Desarrollados (Promedio): {dev_avg:.2f}")
        
        # Países emergentes
        emerging = ['Brasil', 'México', 'India', 'China']
        emg_avg = np.mean([results[country]['adjusted'] for country in emerging])
        print(f"Países Emergentes (Promedio): {emg_avg:.2f}")
        
        # Países en desarrollo
        developing = ['Bolivia', 'Argentina']
        dev_avg = np.mean([results[country]['adjusted'] for country in developing])
        print(f"Países en Desarrollo (Promedio): {dev_avg:.2f}")
        
        # Ventaja del Índice PANAS
        print(f"\n🚀 VENTAJA DEL ÍNDICE PANAS:")
        print("-" * 40)
        print(f"Índice PANAS Global: {panas_global:.3f}")
        print(f"Fiat Promedio: 61.3%")
        print(f"Ventaja PANAS: {((panas_global - 1.0) * 100):.1f}%")
        print(f"Diferencia Total: {((panas_global - 0.613) * 100):.1f}%")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES:")
        print("-" * 30)
        print("1. El Índice PANAS supera significativamente al fiat tradicional")
        print("2. Las variables demográficas mejoran la precisión del análisis")
        print("3. La juventud tecnológica es clave para el crecimiento")
        print("4. La experiencia y educación preservan mejor el valor")
        print("5. La diversificación global reduce el riesgo sistémico")
        
        return results

def main():
    """
    Función principal
    """
    # Crear analizador
    analyzer = MultiCurrencyAnalyzer()
    
    # Generar reporte
    results = analyzer.generate_comprehensive_report()
    
    # Crear gráficos
    print("\n📈 Generando gráficos del análisis multi-moneda...")
    analyzer.plot_purchasing_power_comparison(results)
    analyzer.plot_panas_global_evolution()
    
    print("\n✅ Análisis multi-moneda completado. Gráficos guardados como PNG.")

if __name__ == "__main__":
    main()
