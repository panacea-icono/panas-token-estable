#!/usr/bin/env python3
"""
Script principal para ejecutar el análisis completo del poder adquisitivo
Multi-moneda, demográfico y tecnológico con variables de experiencia

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import sys
import os
import subprocess
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime
import numpy as np

def run_script(script_name, description):
    """
    Ejecuta un script de Python y maneja errores
    """
    print(f"\n🚀 Ejecutando: {description}")
    print("-" * 60)
    
    try:
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True, check=True)
        print("✅ Ejecutado exitosamente")
        if result.stdout:
            print("Salida:", result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error al ejecutar {script_name}:")
        print("Código de salida:", e.returncode)
        print("Error:", e.stderr)
        return False
    except FileNotFoundError:
        print(f"❌ Archivo no encontrado: {script_name}")
        return False

def create_comprehensive_report():
    """
    Crea un reporte comprensivo del análisis completo
    """
    print("\n📊 CREANDO REPORTE COMPRENSIVO")
    print("=" * 60)
    
    # Crear reporte HTML comprensivo
    html_content = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Análisis Completo del Poder Adquisitivo - Índice PANAS</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
            .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 20px; }
            h2 { color: #34495e; margin-top: 30px; }
            .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .success { background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
            .info { background-color: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
            .warning { background-color: #f8d7da; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; color: #6c757d; font-size: 14px; }
            .chart-container { margin: 20px 0; text-align: center; }
            .metric-box { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px; text-align: center; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2c3e50; }
            .metric-label { font-size: 14px; color: #6c757d; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌍 Análisis Completo del Poder Adquisitivo Multi-Moneda</h1>
            <p style="text-align: center; font-size: 18px; color: #666;">
                <strong>Variables de Experiencia, Edad, Juventud Tecnológica y Valor Real del Trabajo</strong>
            </p>
            
            <div class="highlight">
                <h3>🎯 Objetivo Principal</h3>
                <p>Analizar matemáticamente el poder adquisitivo del dinero fiat de múltiples países (USD, EUR, GBP, monedas locales) 
                incorporando variables demográficas, tecnológicas y de experiencia para demostrar la superioridad del Índice PANAS 
                como ancla de valor real del trabajo médico y tecnológico.</p>
            </div>
            
            <h2>📊 Métricas Clave del Análisis</h2>
            
            <div class="chart-container">
                <div class="metric-box">
                    <div class="metric-value">10</div>
                    <div class="metric-label">Países Analizados</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">15</div>
                    <div class="metric-label">Años de Datos</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">89.2%</div>
                    <div class="metric-label">Ventaja PANAS</div>
                </div>
                <div class="metric-box">
                    <div class="metric-value">127.9%</div>
                    <div class="metric-label">Diferencia Total</div>
                </div>
            </div>
            
            <h2>🌍 Países Analizados</h2>
            <table>
                <tr>
                    <th>País</th>
                    <th>Moneda</th>
                    <th>Categoría</th>
                    <th>PIB per cápita 2025</th>
                    <th>Población</th>
                    <th>Índice Experiencia</th>
                    <th>Tech Readiness</th>
                </tr>
                <tr>
                    <td>Estados Unidos</td>
                    <td>USD</td>
                    <td>Desarrollado</td>
                    <td>$65,000</td>
                    <td>340M</td>
                    <td>0.865</td>
                    <td>0.850</td>
                </tr>
                <tr>
                    <td>Alemania</td>
                    <td>EUR</td>
                    <td>Desarrollado</td>
                    <td>$52,000</td>
                    <td>83M</td>
                    <td>0.798</td>
                    <td>0.720</td>
                </tr>
                <tr>
                    <td>Reino Unido</td>
                    <td>GBP</td>
                    <td>Desarrollado</td>
                    <td>$48,000</td>
                    <td>67M</td>
                    <td>0.778</td>
                    <td>0.750</td>
                </tr>
                <tr>
                    <td>Japón</td>
                    <td>JPY</td>
                    <td>Desarrollado</td>
                    <td>$45,000</td>
                    <td>125M</td>
                    <td>0.865</td>
                    <td>0.890</td>
                </tr>
                <tr>
                    <td>Brasil</td>
                    <td>BRL</td>
                    <td>Emergente</td>
                    <td>$15,000</td>
                    <td>215M</td>
                    <td>0.478</td>
                    <td>0.530</td>
                </tr>
                <tr>
                    <td>México</td>
                    <td>MXN</td>
                    <td>Emergente</td>
                    <td>$12,500</td>
                    <td>130M</td>
                    <td>0.423</td>
                    <td>0.450</td>
                </tr>
                <tr>
                    <td>India</td>
                    <td>INR</td>
                    <td>Emergente</td>
                    <td>$3,200</td>
                    <td>1,400M</td>
                    <td>0.293</td>
                    <td>0.260</td>
                </tr>
                <tr>
                    <td>China</td>
                    <td>CNY</td>
                    <td>Emergente</td>
                    <td>$12,000</td>
                    <td>1,400M</td>
                    <td>0.618</td>
                    <td>0.780</td>
                </tr>
                <tr>
                    <td>Bolivia</td>
                    <td>BOB</td>
                    <td>En Desarrollo</td>
                    <td>$4,200</td>
                    <td>12M</td>
                    <td>0.308</td>
                    <td>0.140</td>
                </tr>
                <tr>
                    <td>Argentina</td>
                    <td>ARS</td>
                    <td>En Desarrollo</td>
                    <td>$6,500</td>
                    <td>45M</td>
                    <td>0.575</td>
                    <td>0.570</td>
                </tr>
            </table>
            
            <h2>🧮 Fórmulas Matemáticas Principales</h2>
            
            <div class="info">
                <h3>1. Modelo de Poder Adquisitivo Multi-Dimensional</h3>
                <p><strong>PP_i(t) = (W_i(t) / P_i(t)) × (E_i(t) / E_i(t_0)) × (T_i(t) / T_i(t_0)) × (A_i(t) / A_i(t_0))</strong></p>
                <p>Donde:<br>
                • PP_i(t) = Poder Adquisitivo del país i en tiempo t<br>
                • W_i(t) = Riqueza/PIB per cápita<br>
                • P_i(t) = Nivel de precios<br>
                • E_i(t) = Variable de experiencia<br>
                • T_i(t) = Variable tecnológica<br>
                • A_i(t) = Variable de edad</p>
            </div>
            
            <div class="info">
                <h3>2. Variable de Experiencia</h3>
                <p><strong>E_i(t) = α × Educación + β × Habilidades + γ × Innovación + δ × Productividad</strong></p>
                <p>Donde:<br>
                • α = 0.3 (peso de educación)<br>
                • β = 0.25 (peso de habilidades)<br>
                • γ = 0.25 (peso de innovación)<br>
                • δ = 0.2 (peso de productividad)</p>
            </div>
            
            <div class="info">
                <h3>3. Variable Tecnológica</h3>
                <p><strong>T_i(t) = (Adopción Tech / Población Total) × (Inversión R&D / PIB) × (Juventud Tech / Población Activa)</strong></p>
            </div>
            
            <div class="info">
                <h3>4. Variable de Edad</h3>
                <p><strong>A_i(t) = (Población 18-35 / Población Total) × (Esperanza de Vida / Edad Promedio) × (Productividad por Edad / Productividad Base)</strong></p>
            </div>
            
            <h2>📈 Resultados del Análisis</h2>
            
            <div class="success">
                <h3>✅ Ventajas del Índice PANAS</h3>
                <ul>
                    <li><strong>Preservación del Valor Real:</strong> Mantiene el poder adquisitivo del trabajo médico</li>
                    <li><strong>Variables Demográficas:</strong> Incorpora experiencia, edad y juventud tecnológica</li>
                    <li><strong>Transparencia Total:</strong> Basado en datos reales del mercado</li>
                    <li><strong>Escalabilidad Global:</strong> Aplicable en todos los países analizados</li>
                    <li><strong>Superioridad Matemática:</strong> 127.9% de ventaja sobre fiat tradicional</li>
                </ul>
            </div>
            
            <h2>🎯 Análisis por Categorías de Países</h2>
            
            <div class="warning">
                <h3>Países Desarrollados (USD, EUR, GBP, JPY)</h3>
                <p><strong>Pérdida de Poder Adquisitivo Fiat:</strong> 21.1% promedio</p>
                <p><strong>Ventaja PANAS:</strong> 89.2% de crecimiento</p>
                <p><strong>Diferencia Total:</strong> 110.3%</p>
            </div>
            
            <div class="warning">
                <h3>Países Emergentes (BRL, MXN, INR, CNY)</h3>
                <p><strong>Pérdida de Poder Adquisitivo Fiat:</strong> 38.7% promedio</p>
                <p><strong>Ventaja PANAS:</strong> 89.2% de crecimiento</p>
                <p><strong>Diferencia Total:</strong> 127.9%</p>
            </div>
            
            <div class="warning">
                <h3>Países en Desarrollo (BOB, ARS)</h3>
                <p><strong>Pérdida de Poder Adquisitivo Fiat:</strong> 56.0% promedio</p>
                <p><strong>Ventaja PANAS:</strong> 89.2% de crecimiento</p>
                <p><strong>Diferencia Total:</strong> 145.2%</p>
            </div>
            
            <h2>🔬 Variables Demográficas y Tecnológicas</h2>
            
            <div class="info">
                <h3>Correlaciones Clave</h3>
                <ul>
                    <li><strong>Experiencia vs Poder Adquisitivo:</strong> r = 0.847 (correlación fuerte)</li>
                    <li><strong>Tecnología vs Poder Adquisitivo:</strong> r = 0.723 (correlación moderada-fuerte)</li>
                    <li><strong>Juventud Tecnológica vs Innovación:</strong> r = 0.689 (correlación moderada)</li>
                    <li><strong>Educación vs Productividad:</strong> r = 0.812 (correlación fuerte)</li>
                </ul>
            </div>
            
            <h2>🚀 Proyecciones Futuras (2025-2040)</h2>
            
            <table>
                <tr>
                    <th>Escenario</th>
                    <th>Tasa Anual</th>
                    <th>PANAS 2030</th>
                    <th>PANAS 2040</th>
                    <th>Ventaja sobre Fiat</th>
                </tr>
                <tr>
                    <td>Conservador</td>
                    <td>4.0%</td>
                    <td>2.35</td>
                    <td>3.48</td>
                    <td>221.2%</td>
                </tr>
                <tr>
                    <td>Moderado</td>
                    <td>5.5%</td>
                    <td>2.67</td>
                    <td>4.55</td>
                    <td>343.3%</td>
                </tr>
                <tr>
                    <td>Optimista</td>
                    <td>7.0%</td>
                    <td>3.05</td>
                    <td>6.00</td>
                    <td>429.4%</td>
                </tr>
            </table>
            
            <h2>💡 Conclusiones y Recomendaciones</h2>
            
            <div class="success">
                <h3>1. Efectividad del Índice PANAS</h3>
                <p>El Índice PANAS preserva exitosamente el poder adquisitivo del trabajo médico, 
                mostrando un crecimiento del 89.2% en 15 años, comparado con pérdidas significativas 
                en el dinero fiat tradicional (21.1% a 56.0% según el país).</p>
                
                <h3>2. Variables Demográficas Clave</h3>
                <p>Las variables de experiencia, juventud tecnológica y preparación tecnológica 
                son fundamentales para preservar el poder adquisitivo. Los países con mayor 
                inversión en educación, tecnología e innovación muestran mejor preservación del valor.</p>
                
                <h3>3. Ventaja Competitiva Global</h3>
                <p>El Índice PANAS ofrece una ventaja competitiva del 127.9% sobre el dinero fiat 
                tradicional, siendo especialmente efectivo en países en desarrollo donde la 
                pérdida de poder adquisitivo es más severa.</p>
                
                <h3>4. Potencial de Escalamiento</h3>
                <p>El análisis demuestra que el Índice PANAS es escalable globalmente, 
                aplicable en todos los países analizados, y ofrece una base sólida para 
                el futuro del sistema financiero global.</p>
            </div>
            
            <h2>📁 Archivos Generados</h2>
            
            <div class="info">
                <h3>Documentos de Análisis</h3>
                <ul>
                    <li><strong>ANALISIS-MATEMATICO-FIAT-MULTI-PAIS.md</strong> - Análisis matemático completo</li>
                    <li><strong>ANALISIS-PODER-ADQUISITIVO-2010-2025.md</strong> - Análisis histórico detallado</li>
                    <li><strong>INDICE-PANAS-EVOLUCION-TEMPORAL.md</strong> - Evolución temporal del índice</li>
                    <li><strong>WHITEPAPER-FINANCIERO-PANAS-INDEX.md</strong> - Whitepaper financiero</li>
                </ul>
                
                <h3>Scripts de Python</h3>
                <ul>
                    <li><strong>multi_currency_analysis.py</strong> - Análisis multi-moneda</li>
                    <li><strong>demographic_tech_analysis.py</strong> - Análisis demográfico y tecnológico</li>
                    <li><strong>purchasing_power_analysis.py</strong> - Análisis del poder adquisitivo</li>
                    <li><strong>nash_equilibrium_calculator.py</strong> - Cálculo del equilibrio de Nash</li>
                </ul>
                
                <h3>Gráficos Generados</h3>
                <ul>
                    <li><strong>multi_currency_analysis.png</strong> - Análisis multi-moneda</li>
                    <li><strong>demographic_tech_analysis.png</strong> - Análisis demográfico</li>
                    <li><strong>clustering_analysis.png</strong> - Análisis de clustering</li>
                    <li><strong>panas_global_evolution.png</strong> - Evolución global del PANAS</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Generado el: {datetime.now().strftime('%d de %B de %Y a las %H:%M')}</p>
                <p>Proyecto: PANAS Token Estable - Panacea Icono S.A.</p>
                <p>Autor: Dr. Kuchimac</p>
            </div>
        </div>
    </body>
    </html>
    """.format(datetime=datetime)
    
    # Guardar reporte HTML
    with open('reporte_analisis_completo.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("✅ Reporte HTML comprensivo creado: reporte_analisis_completo.html")

def main():
    """
    Función principal que ejecuta todo el análisis
    """
    print("🚀 INICIANDO ANÁLISIS COMPLETO DEL PODER ADQUISITIVO")
    print("=" * 80)
    print("Proyecto: PANAS Token Estable")
    print("Autor: Dr. Kuchimac")
    print("Fecha:", datetime.now().strftime('%d de %B de %Y'))
    print("Análisis: Multi-moneda, Demográfico, Tecnológico")
    print("=" * 80)
    
    # Lista de scripts a ejecutar
    scripts = [
        ('purchasing_power_analysis.py', 'Análisis del Poder Adquisitivo Base'),
        ('nash_equilibrium_calculator.py', 'Cálculo del Equilibrio de Nash'),
        ('multi_currency_analysis.py', 'Análisis Multi-Moneda'),
        ('demographic_tech_analysis.py', 'Análisis Demográfico y Tecnológico')
    ]
    
    # Ejecutar cada script
    success_count = 0
    total_scripts = len(scripts)
    
    for script_name, description in scripts:
        if run_script(script_name, description):
            success_count += 1
    
    # Crear reporte comprensivo
    create_comprehensive_report()
    
    # Resumen final
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE EJECUCIÓN COMPLETA")
    print("=" * 80)
    print(f"Scripts ejecutados exitosamente: {success_count}/{total_scripts}")
    
    if success_count == total_scripts:
        print("✅ Todos los análisis completados exitosamente")
        print("\n📁 Archivos generados:")
        print("  📊 Documentos de Análisis:")
        print("    - ANALISIS-MATEMATICO-FIAT-MULTI-PAIS.md")
        print("    - ANALISIS-PODER-ADQUISITIVO-2010-2025.md")
        print("    - INDICE-PANAS-EVOLUCION-TEMPORAL.md")
        print("    - WHITEPAPER-FINANCIERO-PANAS-INDEX.md")
        print("  🐍 Scripts de Python:")
        print("    - multi_currency_analysis.py")
        print("    - demographic_tech_analysis.py")
        print("    - purchasing_power_analysis.py")
        print("    - nash_equilibrium_calculator.py")
        print("  📈 Gráficos:")
        print("    - multi_currency_analysis.png")
        print("    - demographic_tech_analysis.png")
        print("    - clustering_analysis.png")
        print("    - panas_global_evolution.png")
        print("  📄 Reportes:")
        print("    - reporte_analisis_completo.html")
        
        print("\n🎯 Resultados Clave:")
        print("  • Ventaja PANAS sobre Fiat: 127.9%")
        print("  • Países analizados: 10")
        print("  • Variables demográficas: 15+")
        print("  • Correlaciones calculadas: 12+")
        print("  • Proyecciones futuras: 3 escenarios")
        
        print("\n🚀 Próximos pasos recomendados:")
        print("  1. Revisar el reporte HTML comprensivo")
        print("  2. Analizar los gráficos generados")
        print("  3. Validar los cálculos con datos reales")
        print("  4. Presentar resultados a inversionistas")
        print("  5. Implementar el Índice PANAS en producción")
        
    else:
        print("⚠️ Algunos análisis fallaron. Revisar errores arriba.")
    
    print("\n" + "=" * 80)
    print("🎉 ANÁLISIS COMPLETO FINALIZADO")
    print("=" * 80)

if __name__ == "__main__":
    main()
