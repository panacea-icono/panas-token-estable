#!/usr/bin/env python3
"""
Análisis Demográfico y Tecnológico del Poder Adquisitivo
Variables de Experiencia, Edad, Juventud Tecnológica y Valor Real del Trabajo

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import minimize
from scipy.stats import pearsonr, spearmanr, linregress
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

# Configuración de estilo
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class DemographicTechAnalyzer:
    """
    Analizador demográfico y tecnológico del poder adquisitivo
    """
    
    def __init__(self):
        self.base_year = 2010
        self.years = [2010, 2015, 2020, 2025]
        
        # Datos demográficos y tecnológicos por país
        self.demographic_data = {
            'Estados Unidos': {
                'population': 340000000,
                'gdp_per_capita': 65000,
                'education_rate': 95,
                'tech_adoption': 85,
                'youth_population': 35,
                'life_expectancy': 78,
                'avg_age': 38,
                'innovation_index': 8.5,
                'digital_skills': 78,
                'rd_investment': 2.8,
                'startup_ecosystem': 9.2,
                'ai_readiness': 8.8,
                'blockchain_adoption': 6.5,
                'crypto_penetration': 15.2
            },
            'Alemania': {
                'population': 83000000,
                'gdp_per_capita': 52000,
                'education_rate': 92,
                'tech_adoption': 80,
                'youth_population': 28,
                'life_expectancy': 81,
                'avg_age': 44,
                'innovation_index': 7.2,
                'digital_skills': 72,
                'rd_investment': 3.1,
                'startup_ecosystem': 7.8,
                'ai_readiness': 7.5,
                'blockchain_adoption': 5.2,
                'crypto_penetration': 8.9
            },
            'Reino Unido': {
                'population': 67000000,
                'gdp_per_capita': 48000,
                'education_rate': 88,
                'tech_adoption': 82,
                'youth_population': 32,
                'life_expectancy': 81,
                'avg_age': 40,
                'innovation_index': 6.8,
                'digital_skills': 75,
                'rd_investment': 1.7,
                'startup_ecosystem': 8.5,
                'ai_readiness': 8.2,
                'blockchain_adoption': 6.8,
                'crypto_penetration': 12.1
            },
            'Japón': {
                'population': 125000000,
                'gdp_per_capita': 45000,
                'education_rate': 94,
                'tech_adoption': 90,
                'youth_population': 22,
                'life_expectancy': 84,
                'avg_age': 48,
                'innovation_index': 8.1,
                'digital_skills': 85,
                'rd_investment': 3.2,
                'startup_ecosystem': 6.5,
                'ai_readiness': 8.9,
                'blockchain_adoption': 4.8,
                'crypto_penetration': 6.2
            },
            'Brasil': {
                'population': 215000000,
                'gdp_per_capita': 15000,
                'education_rate': 65,
                'tech_adoption': 60,
                'youth_population': 42,
                'life_expectancy': 75,
                'avg_age': 33,
                'innovation_index': 2.1,
                'digital_skills': 45,
                'rd_investment': 1.3,
                'startup_ecosystem': 5.8,
                'ai_readiness': 4.2,
                'blockchain_adoption': 3.5,
                'crypto_penetration': 4.8
            },
            'México': {
                'population': 130000000,
                'gdp_per_capita': 12500,
                'education_rate': 58,
                'tech_adoption': 55,
                'youth_population': 45,
                'life_expectancy': 75,
                'avg_age': 29,
                'innovation_index': 1.8,
                'digital_skills': 38,
                'rd_investment': 0.5,
                'startup_ecosystem': 4.2,
                'ai_readiness': 3.8,
                'blockchain_adoption': 2.8,
                'crypto_penetration': 3.5
            },
            'India': {
                'population': 1400000000,
                'gdp_per_capita': 3200,
                'education_rate': 35,
                'tech_adoption': 40,
                'youth_population': 55,
                'life_expectancy': 70,
                'avg_age': 28,
                'innovation_index': 1.2,
                'digital_skills': 25,
                'rd_investment': 0.7,
                'startup_ecosystem': 6.8,
                'ai_readiness': 5.5,
                'blockchain_adoption': 4.2,
                'crypto_penetration': 2.1
            },
            'China': {
                'population': 1400000000,
                'gdp_per_capita': 12000,
                'education_rate': 70,
                'tech_adoption': 75,
                'youth_population': 40,
                'life_expectancy': 77,
                'avg_age': 38,
                'innovation_index': 4.2,
                'digital_skills': 60,
                'rd_investment': 2.4,
                'startup_ecosystem': 7.5,
                'ai_readiness': 7.8,
                'blockchain_adoption': 6.2,
                'crypto_penetration': 5.8
            },
            'Bolivia': {
                'population': 12000000,
                'gdp_per_capita': 4200,
                'education_rate': 45,
                'tech_adoption': 35,
                'youth_population': 50,
                'life_expectancy': 72,
                'avg_age': 26,
                'innovation_index': 0.8,
                'digital_skills': 30,
                'rd_investment': 0.2,
                'startup_ecosystem': 2.8,
                'ai_readiness': 2.5,
                'blockchain_adoption': 1.8,
                'crypto_penetration': 1.2
            },
            'Argentina': {
                'population': 45000000,
                'gdp_per_capita': 6500,
                'education_rate': 85,
                'tech_adoption': 65,
                'youth_population': 35,
                'life_expectancy': 76,
                'avg_age': 32,
                'innovation_index': 2.5,
                'digital_skills': 55,
                'rd_investment': 0.8,
                'startup_ecosystem': 4.5,
                'ai_readiness': 4.8,
                'blockchain_adoption': 3.2,
                'crypto_penetration': 2.8
            }
        }
        
        # Variables de experiencia por edad
        self.age_experience_curves = {
            '18-25': {'experience': 0.3, 'tech_adaptation': 0.9, 'innovation': 0.8, 'productivity': 0.6},
            '26-35': {'experience': 0.6, 'tech_adaptation': 0.95, 'innovation': 0.9, 'productivity': 0.8},
            '36-45': {'experience': 0.8, 'tech_adaptation': 0.7, 'innovation': 0.85, 'productivity': 0.95},
            '46-55': {'experience': 0.9, 'tech_adaptation': 0.5, 'innovation': 0.7, 'productivity': 0.9},
            '56-65': {'experience': 0.95, 'tech_adaptation': 0.3, 'innovation': 0.5, 'productivity': 0.8},
            '65+': {'experience': 1.0, 'tech_adaptation': 0.2, 'innovation': 0.3, 'productivity': 0.6}
        }
    
    def calculate_experience_index(self, country):
        """
        Calcula el índice de experiencia para un país
        """
        data = self.demographic_data[country]
        
        # Componentes del índice de experiencia
        education = data['education_rate'] / 100
        digital_skills = data['digital_skills'] / 100
        innovation = data['innovation_index'] / 10
        rd_investment = data['rd_investment'] / 5  # Normalizar
        
        # Fórmula ponderada
        experience_index = (0.3 * education + 
                          0.25 * digital_skills + 
                          0.25 * innovation + 
                          0.2 * rd_investment)
        
        return min(experience_index, 1.0)
    
    def calculate_tech_readiness(self, country):
        """
        Calcula la preparación tecnológica de un país
        """
        data = self.demographic_data[country]
        
        # Componentes de preparación tecnológica
        tech_adoption = data['tech_adoption'] / 100
        ai_readiness = data['ai_readiness'] / 10
        blockchain_adoption = data['blockchain_adoption'] / 10
        crypto_penetration = data['crypto_penetration'] / 20  # Normalizar
        
        # Fórmula ponderada
        tech_readiness = (0.3 * tech_adoption + 
                        0.3 * ai_readiness + 
                        0.2 * blockchain_adoption + 
                        0.2 * crypto_penetration)
        
        return min(tech_readiness, 1.0)
    
    def calculate_youth_tech_factor(self, country):
        """
        Calcula el factor de juventud tecnológica
        """
        data = self.demographic_data[country]
        
        # Componentes del factor juventud
        youth_population = data['youth_population'] / 100
        startup_ecosystem = data['startup_ecosystem'] / 10
        tech_adoption = data['tech_adoption'] / 100
        
        # Fórmula ponderada
        youth_tech_factor = (0.4 * youth_population + 
                           0.3 * startup_ecosystem + 
                           0.3 * tech_adoption)
        
        return min(youth_tech_factor, 1.0)
    
    def calculate_age_productivity_curve(self, country):
        """
        Calcula la curva de productividad por edad
        """
        data = self.demographic_data[country]
        avg_age = data['avg_age']
        
        # Determinar grupo de edad
        if avg_age <= 25:
            age_group = '18-25'
        elif avg_age <= 35:
            age_group = '26-35'
        elif avg_age <= 45:
            age_group = '36-45'
        elif avg_age <= 55:
            age_group = '46-55'
        elif avg_age <= 65:
            age_group = '56-65'
        else:
            age_group = '65+'
        
        # Obtener factores del grupo de edad
        factors = self.age_experience_curves[age_group]
        
        # Calcular productividad ajustada por edad
        age_productivity = (factors['experience'] * 
                          factors['tech_adaptation'] * 
                          factors['innovation'] * 
                          factors['productivity'])
        
        return age_productivity, age_group
    
    def calculate_comprehensive_index(self, country):
        """
        Calcula el índice comprensivo de poder adquisitivo
        """
        # Calcular todos los índices
        experience = self.calculate_experience_index(country)
        tech_readiness = self.calculate_tech_readiness(country)
        youth_tech = self.calculate_youth_tech_factor(country)
        age_productivity, age_group = self.calculate_age_productivity_curve(country)
        
        # Índice comprensivo
        comprehensive_index = (0.3 * experience + 
                             0.25 * tech_readiness + 
                             0.25 * youth_tech + 
                             0.2 * age_productivity)
        
        return {
            'comprehensive': comprehensive_index,
            'experience': experience,
            'tech_readiness': tech_readiness,
            'youth_tech': youth_tech,
            'age_productivity': age_productivity,
            'age_group': age_group
        }
    
    def analyze_all_countries(self):
        """
        Análisis completo de todos los países
        """
        results = {}
        
        for country in self.demographic_data.keys():
            results[country] = self.calculate_comprehensive_index(country)
        
        return results
    
    def perform_clustering_analysis(self, results):
        """
        Realiza análisis de clustering de países
        """
        # Preparar datos para clustering
        countries = list(results.keys())
        features = []
        
        for country in countries:
            data = results[country]
            features.append([
                data['experience'],
                data['tech_readiness'],
                data['youth_tech'],
                data['age_productivity']
            ])
        
        features = np.array(features)
        
        # Normalizar características
        scaler = StandardScaler()
        features_scaled = scaler.fit_transform(features)
        
        # Clustering K-means
        kmeans = KMeans(n_clusters=3, random_state=42)
        clusters = kmeans.fit_predict(features_scaled)
        
        # Crear DataFrame
        df = pd.DataFrame({
            'Country': countries,
            'Cluster': clusters,
            'Experience': [results[country]['experience'] for country in countries],
            'Tech_Readiness': [results[country]['tech_readiness'] for country in countries],
            'Youth_Tech': [results[country]['youth_tech'] for country in countries],
            'Age_Productivity': [results[country]['age_productivity'] for country in countries],
            'Comprehensive': [results[country]['comprehensive'] for country in countries]
        })
        
        return df, features_scaled
    
    def plot_demographic_analysis(self, results):
        """
        Gráficos del análisis demográfico
        """
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        fig.suptitle('Análisis Demográfico y Tecnológico del Poder Adquisitivo', fontsize=16, fontweight='bold')
        
        countries = list(results.keys())
        experience = [results[country]['experience'] for country in countries]
        tech_readiness = [results[country]['tech_readiness'] for country in countries]
        youth_tech = [results[country]['youth_tech'] for country in countries]
        age_productivity = [results[country]['age_productivity'] for country in countries]
        comprehensive = [results[country]['comprehensive'] for country in countries]
        
        # Gráfico 1: Índice de Experiencia
        ax1 = axes[0, 0]
        bars1 = ax1.bar(range(len(countries)), experience, color='skyblue', alpha=0.7)
        ax1.set_title('Índice de Experiencia por País', fontsize=14)
        ax1.set_xlabel('Países')
        ax1.set_ylabel('Índice de Experiencia')
        ax1.set_xticks(range(len(countries)))
        ax1.set_xticklabels(countries, rotation=45, ha='right')
        ax1.grid(True, alpha=0.3)
        
        # Añadir valores en las barras
        for i, bar in enumerate(bars1):
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                    f'{height:.3f}', ha='center', va='bottom', fontsize=8)
        
        # Gráfico 2: Preparación Tecnológica
        ax2 = axes[0, 1]
        bars2 = ax2.bar(range(len(countries)), tech_readiness, color='lightcoral', alpha=0.7)
        ax2.set_title('Preparación Tecnológica por País', fontsize=14)
        ax2.set_xlabel('Países')
        ax2.set_ylabel('Preparación Tecnológica')
        ax2.set_xticks(range(len(countries)))
        ax2.set_xticklabels(countries, rotation=45, ha='right')
        ax2.grid(True, alpha=0.3)
        
        # Gráfico 3: Factor Juventud Tecnológica
        ax3 = axes[0, 2]
        bars3 = ax3.bar(range(len(countries)), youth_tech, color='lightgreen', alpha=0.7)
        ax3.set_title('Factor Juventud Tecnológica por País', fontsize=14)
        ax3.set_xlabel('Países')
        ax3.set_ylabel('Factor Juventud Tecnológica')
        ax3.set_xticks(range(len(countries)))
        ax3.set_xticklabels(countries, rotation=45, ha='right')
        ax3.grid(True, alpha=0.3)
        
        # Gráfico 4: Correlación Experiencia vs Tech Readiness
        ax4 = axes[1, 0]
        ax4.scatter(experience, tech_readiness, s=100, alpha=0.7, color='purple')
        
        # Línea de tendencia
        z = np.polyfit(experience, tech_readiness, 1)
        p = np.poly1d(z)
        ax4.plot(experience, p(experience), "r--", alpha=0.8)
        
        # Calcular correlación
        corr, _ = pearsonr(experience, tech_readiness)
        ax4.set_title(f'Experiencia vs Preparación Tecnológica\nr = {corr:.3f}', fontsize=14)
        ax4.set_xlabel('Índice de Experiencia')
        ax4.set_ylabel('Preparación Tecnológica')
        ax4.grid(True, alpha=0.3)
        
        # Añadir etiquetas de países
        for i, country in enumerate(countries):
            ax4.annotate(country, (experience[i], tech_readiness[i]), 
                        xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        # Gráfico 5: Juventud vs Productividad por Edad
        ax5 = axes[1, 1]
        ax5.scatter(youth_tech, age_productivity, s=100, alpha=0.7, color='orange')
        
        # Línea de tendencia
        z = np.polyfit(youth_tech, age_productivity, 1)
        p = np.poly1d(z)
        ax5.plot(youth_tech, p(youth_tech), "r--", alpha=0.8)
        
        # Calcular correlación
        corr, _ = pearsonr(youth_tech, age_productivity)
        ax5.set_title(f'Juventud Tecnológica vs Productividad por Edad\nr = {corr:.3f}', fontsize=14)
        ax5.set_xlabel('Factor Juventud Tecnológica')
        ax5.set_ylabel('Productividad por Edad')
        ax5.grid(True, alpha=0.3)
        
        # Gráfico 6: Índice Comprensivo
        ax6 = axes[1, 2]
        bars6 = ax6.bar(range(len(countries)), comprehensive, color='gold', alpha=0.7)
        ax6.set_title('Índice Comprensivo por País', fontsize=14)
        ax6.set_xlabel('Países')
        ax6.set_ylabel('Índice Comprensivo')
        ax6.set_xticks(range(len(countries)))
        ax6.set_xticklabels(countries, rotation=45, ha='right')
        ax6.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('demographic_tech_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def plot_clustering_analysis(self, df, features_scaled):
        """
        Gráfico del análisis de clustering
        """
        fig, axes = plt.subplots(1, 2, figsize=(15, 6))
        fig.suptitle('Análisis de Clustering de Países', fontsize=16, fontweight='bold')
        
        # Gráfico 1: Clustering 2D
        ax1 = axes[0]
        scatter = ax1.scatter(features_scaled[:, 0], features_scaled[:, 1], 
                             c=df['Cluster'], cmap='viridis', s=100, alpha=0.7)
        ax1.set_title('Clustering 2D (Experiencia vs Tech Readiness)', fontsize=14)
        ax1.set_xlabel('Experiencia (Normalizada)')
        ax1.set_ylabel('Tech Readiness (Normalizada)')
        ax1.grid(True, alpha=0.3)
        
        # Añadir etiquetas de países
        for i, country in enumerate(df['Country']):
            ax1.annotate(country, (features_scaled[i, 0], features_scaled[i, 1]), 
                        xytext=(5, 5), textcoords='offset points', fontsize=8)
        
        # Gráfico 2: Distribución por Cluster
        ax2 = axes[1]
        cluster_counts = df['Cluster'].value_counts().sort_index()
        bars = ax2.bar(cluster_counts.index, cluster_counts.values, 
                      color=['red', 'green', 'blue'], alpha=0.7)
        ax2.set_title('Distribución de Países por Cluster', fontsize=14)
        ax2.set_xlabel('Cluster')
        ax2.set_ylabel('Número de Países')
        ax2.grid(True, alpha=0.3)
        
        # Añadir valores en las barras
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                    f'{int(height)}', ha='center', va='bottom', fontsize=12)
        
        plt.tight_layout()
        plt.savefig('clustering_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def generate_demographic_report(self):
        """
        Genera reporte del análisis demográfico
        """
        print("=" * 80)
        print("ANÁLISIS DEMOGRÁFICO Y TECNOLÓGICO DEL PODER ADQUISITIVO")
        print("Variables de Experiencia, Edad, Juventud Tecnológica")
        print("=" * 80)
        
        # Análisis de todos los países
        results = self.analyze_all_countries()
        
        print("\n📊 ÍNDICES DEMOGRÁFICOS POR PAÍS:")
        print("-" * 80)
        print(f"{'País':<15} {'Experiencia':<12} {'Tech Readiness':<15} {'Juventud Tech':<15} {'Productividad':<12} {'Comprensivo':<12}")
        print("-" * 80)
        
        for country, data in results.items():
            print(f"{country:<15} {data['experience']:<12.3f} {data['tech_readiness']:<15.3f} "
                  f"{data['youth_tech']:<15.3f} {data['age_productivity']:<12.3f} {data['comprehensive']:<12.3f}")
        
        # Análisis de clustering
        df, features_scaled = self.perform_clustering_analysis(results)
        
        print(f"\n🎯 ANÁLISIS DE CLUSTERING:")
        print("-" * 40)
        print("Cluster 0 (Desarrollados):")
        cluster0 = df[df['Cluster'] == 0]['Country'].tolist()
        print(f"  Países: {', '.join(cluster0)}")
        
        print("\nCluster 1 (Emergentes):")
        cluster1 = df[df['Cluster'] == 1]['Country'].tolist()
        print(f"  Países: {', '.join(cluster1)}")
        
        print("\nCluster 2 (En Desarrollo):")
        cluster2 = df[df['Cluster'] == 2]['Country'].tolist()
        print(f"  Países: {', '.join(cluster2)}")
        
        # Análisis de correlaciones
        print(f"\n📈 ANÁLISIS DE CORRELACIONES:")
        print("-" * 40)
        
        experience = [results[country]['experience'] for country in results.keys()]
        tech_readiness = [results[country]['tech_readiness'] for country in results.keys()]
        youth_tech = [results[country]['youth_tech'] for country in results.keys()]
        comprehensive = [results[country]['comprehensive'] for country in results.keys()]
        
        corr_exp_tech, _ = pearsonr(experience, tech_readiness)
        corr_youth_comp, _ = pearsonr(youth_tech, comprehensive)
        corr_exp_comp, _ = pearsonr(experience, comprehensive)
        
        print(f"Experiencia vs Tech Readiness: {corr_exp_tech:.3f}")
        print(f"Juventud Tech vs Comprensivo: {corr_youth_comp:.3f}")
        print(f"Experiencia vs Comprensivo: {corr_exp_comp:.3f}")
        
        # Análisis por grupos de edad
        print(f"\n👥 ANÁLISIS POR GRUPOS DE EDAD:")
        print("-" * 40)
        
        age_groups = {}
        for country, data in results.items():
            age_group = data['age_group']
            if age_group not in age_groups:
                age_groups[age_group] = []
            age_groups[age_group].append(country)
        
        for age_group, countries in age_groups.items():
            print(f"{age_group}: {', '.join(countries)}")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES DEMOGRÁFICAS:")
        print("-" * 40)
        print("1. Los países con mayor experiencia tienen mejor poder adquisitivo")
        print("2. La preparación tecnológica es clave para el crecimiento")
        print("3. La juventud tecnológica impulsa la innovación")
        print("4. La productividad por edad varía según el desarrollo del país")
        print("5. El índice comprensivo combina todas las variables efectivamente")
        
        return results, df

def main():
    """
    Función principal
    """
    # Crear analizador
    analyzer = DemographicTechAnalyzer()
    
    # Generar reporte
    results, df = analyzer.generate_demographic_report()
    
    # Crear gráficos
    print("\n📈 Generando gráficos del análisis demográfico...")
    analyzer.plot_demographic_analysis(results)
    
    # Análisis de clustering
    df, features_scaled = analyzer.perform_clustering_analysis(results)
    analyzer.plot_clustering_analysis(df, features_scaled)
    
    print("\n✅ Análisis demográfico completado. Gráficos guardados como PNG.")

if __name__ == "__main__":
    main()
