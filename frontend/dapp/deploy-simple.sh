#!/bin/bash

# Configuración
VERCEL_TOKEN="zQH5Z6UcVPqS3n0taELmTeXs"
PROJECT_ID="prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"
DOMAIN="token.panas.app"

echo "🚀 Desplegando PANAS Token Estable..."

# Crear un archivo temporal con el contenido HTML
cat > temp-deployment.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PANAS Token Estable</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
        }
        h1 { color: #333; margin-bottom: 20px; }
        p { color: #666; line-height: 1.6; margin-bottom: 30px; }
        .status { 
            background: #4CAF50; 
            color: white; 
            padding: 10px 20px; 
            border-radius: 5px; 
            display: inline-block;
            margin-bottom: 30px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .feature {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .info {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 PANAS Token Estable</h1>
        <p>
            Token índice estable multi-activo respaldado por VASER (Solana), KUCHI (BSC), 
            NF Domains (Algorand) y colaterales.
        </p>
        
        <div class="status">✅ Webhook Configurado</div>
        
        <div class="features">
            <div class="feature">
                <h3>🔗 Multi-Blockchain</h3>
                <p>Algorand, Solana, BSC, TON</p>
            </div>
            <div class="feature">
                <h3>📊 Índice Fiat</h3>
                <p>FX Oficial, Paralelo, USDT</p>
            </div>
            <div class="feature">
                <h3>🔒 Seguro</h3>
                <p>Respaldado por activos</p>
            </div>
        </div>
        
        <div class="info">
            <p><strong>Webhook Token:</strong> eIhe5OXfe9gq7SeUPHAD0Xpw</p>
            <p><strong>Proyecto:</strong> prj_8V2CEf88FXnIGzRNW88nnXe6dDAU</p>
            <p><strong>API Key:</strong> zQH5Z6UcVPqS3n0taELmTeXs</p>
        </div>
    </div>
</body>
</html>
EOF

echo "✅ Archivo HTML creado"

# Crear un deployment usando la API de Vercel
echo "📦 Creando deployment..."

# Crear un archivo ZIP con el contenido
zip -r deployment.zip temp-deployment.html public/

# Usar la API de Vercel para crear el deployment
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "panas-token-estable",
    "project": "'$PROJECT_ID'",
    "target": "production"
  }' \
  "https://api.vercel.com/v13/deployments")

echo "📋 Respuesta del deployment:"
echo "$RESPONSE" | head -10

# Limpiar archivos temporales
rm -f temp-deployment.html deployment.zip

echo "🎉 Deployment completado!"
echo "🌐 Visita: https://$DOMAIN"
