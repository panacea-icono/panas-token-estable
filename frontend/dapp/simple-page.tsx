export default function SimplePage() {
  return (
    <html>
      <head>
        <title>PANAS Token Estable</title>
        <style>{`
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
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>🚀 PANAS Token Estable</h1>
          <p>
            Token índice estable multi-activo respaldado por VASER (Solana), KUCHI (BSC), 
            NF Domains (Algorand) y colaterales.
          </p>
          
          <div className="status">✅ Webhook Configurado</div>
          
          <div className="features">
            <div className="feature">
              <h3>🔗 Multi-Blockchain</h3>
              <p>Algorand, Solana, BSC, TON</p>
            </div>
            <div className="feature">
              <h3>📊 Índice Fiat</h3>
              <p>FX Oficial, Paralelo, USDT</p>
            </div>
            <div className="feature">
              <h3>🔒 Seguro</h3>
              <p>Respaldado por activos</p>
            </div>
          </div>
          
          <p style={{marginTop: '30px', fontSize: '14px', color: '#999'}}>
            Webhook Token: eIhe5OXfe9gq7SeUPHAD0Xpw<br/>
            Proyecto: prj_8V2CEf88FXnIGzRNW88nnXe6dDAU
          </p>
        </div>
      </body>
    </html>
  )
}
