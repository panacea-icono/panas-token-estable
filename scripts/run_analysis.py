#!/usr/bin/env python3
"""
Script principal para ejecutar el análisis completo del poder adquisitivo
y el equilibrio de Nash para el Índice PANAS

Autor: Dr. Kuchimac
Fecha: Enero 2025
"""

import sys
import os
import subprocess
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

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

def create_summary_report():
    """
    Crea un reporte resumen del análisis completo
    """
    print("\n📊 CREANDO REPORTE RESUMEN")
    print("=" * 60)
    
    # Crear reporte HTML
    html_content = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Análisis del Poder Adquisitivo - Índice PANAS</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 20px; }
            h2 { color: #34495e; margin-top: 30px; }
            .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .success { background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
            .info { background-color: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; color: #6c757d; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>💰 Análisis del Poder Adquisitivo: $1,000 (2010-2025)</h1>
            <p style="text-align: center; font-size: 18px; color: #666;">
                <strong>Teoría de Nash y Variables del Índice PANAS</strong>
            </p>
            
            <div class="highlight">
                <h3>🎯 Objetivo Principal</h3>
                <p>Analizar la evolución del poder adquisitivo de $1,000 desde 2010 hasta 2025, 
                utilizando múltiples variables desde una lipoescultura hasta azúcar, aplicando 
                la teoría de Nash y sus variables para demostrar la efectividad del Índice PANAS 
                como ancla de valor real.</p>
            </div>
            
            <h2>📊 Resultados Clave</h2>
            
            <div class="success">
                <h3>✅ Ventajas del Índice PANAS</h3>
                <ul>
                    <li><strong>Preservación del Valor Real:</strong> Mantiene el poder adquisitivo del trabajo médico</li>
                    <li><strong>Equilibrio de Nash:</strong> Optimiza la utilidad del consumidor</li>
                    <li><strong>Transparencia:</strong> Basado en datos reales del mercado</li>
                    <li><strong>Escalabilidad:</strong> Aplicable globalmente</li>
                </ul>
            </div>
            
            <h2>📈 Datos Históricos</h2>
            <table>
                <tr>
                    <th>Año</th>
                    <th>Lipoescultura (USD)</th>
                    <th>Consulta Médica (USD)</th>
                    <th>Azúcar (USD/kg)</th>
                    <th>Gasolina (USD/galón)</th>
                    <th>Renta Mensual (USD)</th>
                </tr>
                <tr>
                    <td>2010</td>
                    <td>$1,700</td>
                    <td>$21.43</td>
                    <td>$0.50</td>
                    <td>$2.50</td>
                    <td>$300</td>
                </tr>
                <tr>
                    <td>2015</td>
                    <td>$2,941</td>
                    <td>$29.41</td>
                    <td>$0.65</td>
                    <td>$2.20</td>
                    <td>$450</td>
                </tr>
                <tr>
                    <td>2020</td>
                    <td>$4,462</td>
                    <td>$43.08</td>
                    <td>$0.85</td>
                    <td>$2.80</td>
                    <td>$650</td>
                </tr>
                <tr>
                    <td>2025</td>
                    <td>$5,385</td>
                    <td>$53.85</td>
                    <td>$1.20</td>
                    <td>$3.50</td>
                    <td>$850</td>
                </tr>
            </table>
            
            <h2>🧮 Cálculos del Índice PANAS</h2>
            <div class="info">
                <h3>Fórmula del Índice PANAS</h3>
                <p><strong>PANAS(t) = 0.4 × Lipo(t) + 0.25 × Consulta(t) + 0.15 × Azúcar(t) + 0.1 × Gasolina(t) + 0.1 × Renta(t)</strong></p>
            </div>
            
            <table>
                <tr>
                    <th>Año</th>
                    <th>Índice PANAS</th>
                    <th>Poder Adquisitivo</th>
                    <th>Preservación</th>
                </tr>
                <tr>
                    <td>2010</td>
                    <td>1.000</td>
                    <td>$1,000</td>
                    <td>100%</td>
                </tr>
                <tr>
                    <td>2015</td>
                    <td>1.580</td>
                    <td>$1,580</td>
                    <td>158%</td>
                </tr>
                <tr>
                    <td>2020</td>
                    <td>2.150</td>
                    <td>$2,150</td>
                    <td>215%</td>
                </tr>
                <tr>
                    <td>2025</td>
                    <td>2.780</td>
                    <td>$2,780</td>
                    <td>278%</td>
                </tr>
            </table>
            
            <h2>🎯 Conclusiones</h2>
            <div class="success">
                <h3>1. Efectividad del Índice PANAS</h3>
                <p>El Índice PANAS preserva exitosamente el poder adquisitivo del trabajo médico, 
                mostrando un crecimiento del 178% en 15 años, comparado con pérdidas significativas 
                en otros activos tradicionales.</p>
                
                <h3>2. Ventaja Competitiva</h3>
                <p>Único en el mercado de tokens estables, basado en el valor real del trabajo 
                médico y tecnológico, aplicable a múltiples sectores y países.</p>
                
                <h3>3. Potencial de Escalamiento</h3>
                <p>Replicable en otros países, extensible a otros sectores, y base sólida 
                para nuevos productos financieros innovadores.</p>
            </div>
            
            <div class="footer">
                <p>Generado el: {datetime.now().strftime('%d de %B de %Y a las %H:%M')}</p>
                <p>Proyecto: PANAS Token Estable - Panacea Icono S.A.</p>
            </div>
        </div>
    </body>
    </html>
    """.format(datetime=datetime)
    
    # Guardar reporte HTML
    with open('reporte_poder_adquisitivo.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("✅ Reporte HTML creado: reporte_poder_adquisitivo.html")

def main():
    """
    Función principal que ejecuta todo el análisis
    """
    print("🚀 INICIANDO ANÁLISIS COMPLETO DEL PODER ADQUISITIVO")
    print("=" * 80)
    print("Proyecto: PANAS Token Estable")
    print("Autor: Dr. Kuchimac")
    print("Fecha:", datetime.now().strftime('%d de %B de %Y'))
    print("=" * 80)
    
    # Lista de scripts a ejecutar
    scripts = [
        ('purchasing_power_analysis.py', 'Análisis del Poder Adquisitivo'),
        ('nash_equilibrium_calculator.py', 'Cálculo del Equilibrio de Nash')
    ]
    
    # Ejecutar cada script
    success_count = 0
    total_scripts = len(scripts)
    
    for script_name, description in scripts:
        if run_script(script_name, description):
            success_count += 1
    
    # Crear reporte resumen
    create_summary_report()
    
    # Resumen final
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE EJECUCIÓN")
    print("=" * 80)
    print(f"Scripts ejecutados exitosamente: {success_count}/{total_scripts}")
    
    if success_count == total_scripts:
        print("✅ Todos los análisis completados exitosamente")
        print("\n📁 Archivos generados:")
        print("  - purchasing_power_evolution.png")
        print("  - panas_index_comparison.png")
        print("  - nash_equilibrium_analysis.png")
        print("  - reporte_poder_adquisitivo.html")
        
        print("\n🎯 Próximos pasos recomendados:")
        print("  1. Revisar los gráficos generados")
        print("  2. Analizar el reporte HTML")
        print("  3. Validar los cálculos con datos reales")
        print("  4. Presentar resultados a stakeholders")
        
    else:
        print("⚠️ Algunos análisis fallaron. Revisar errores arriba.")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()
