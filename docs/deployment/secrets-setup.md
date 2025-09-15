# 🔐 Configuración de Secretos para GitHub Actions

## 📋 Secretos Requeridos

Para que el pipeline de CI/CD funcione correctamente, necesitas configurar los
siguientes secretos en tu repositorio de GitHub:

### 1. **SNYK_TOKEN** (Opcional)

- **Descripción**: Token de API de Snyk para análisis de vulnerabilidades

- **Cómo obtener**:

  1. Crear cuenta en [Snyk](https://snyk.io)
  2. Ir a Account Settings > API Token
  3. Copiar el token generado

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevo secreto:
  Name: SNYK_TOKEN
  Value: tu_token_de_snyk_aqui
  ```

### 2. **TESTNET_WALLET_MNEMONIC** (Requerido para testnet)

- **Descripción**: Mnemónico de la wallet para despliegues en testnet

- **Cómo obtener**:

  1. Crear wallet en [Pera Wallet](https://perawallet.app)
  2. Exportar mnemónico (24 palabras)
  3. **⚠️ IMPORTANTE**: Solo usar wallet de prueba, nunca la principal

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevo secreto:
  Name: TESTNET_WALLET_MNEMONIC
  Value: palabra1 palabra2 palabra3 ... palabra24
  ```

### 3. **MAINNET_WALLET_MNEMONIC** (Requerido para mainnet)

- **Descripción**: Mnemónico de la wallet para despliegues en mainnet

- **Cómo obtener**:

  1. Crear wallet segura para producción
  2. Exportar mnemónico (24 palabras)
  3. **⚠️ CRÍTICO**: Esta wallet manejará fondos reales

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevo secreto:
  Name: MAINNET_WALLET_MNEMONIC
  Value: palabra1 palabra2 palabra3 ... palabra24
  ```

### 4. **VERCEL_TOKEN** (Requerido para despliegue frontend)

- **Descripción**: Token de API de Vercel para despliegues automáticos

- **Cómo obtener**:

  1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
  2. Ir a Settings > Tokens
  3. Crear nuevo token con permisos de deployment
  4. Copiar el token generado

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevo secreto:
  Name: VERCEL_TOKEN
  Value: eIhe5OXfe9gq7SeUPHAD0Xpw
  ```

### 5. **VERCEL_WEBHOOK_TOKEN** (Requerido para webhooks)

- **Descripción**: Token secreto para verificar webhooks de Vercel

- **Cómo obtener**:

  1. Usar el mismo token de Vercel o generar uno específico
  2. Este token se usa para verificar la autenticidad de los webhooks
  3. **⚠️ IMPORTANTE**: Mantener este token seguro

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevo secreto:
  Name: VERCEL_WEBHOOK_TOKEN
  Value: eIhe5OXfe9gq7SeUPHAD0Xpw
  ```

### 6. **VERCEL_ORG_ID** y **VERCEL_PROJECT_ID** (Requeridos para despliegue)

- **Descripción**: IDs de organización y proyecto de Vercel

- **Cómo obtener**:

  1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
  2. Seleccionar el proyecto panas-token-estable
  3. Ir a Settings > General
  4. Copiar Project ID y Organization ID

- **Configuración**:

  ```bash
  # En GitHub: Settings > Secrets and variables > Actions
  # Agregar nuevos secretos:
  Name: VERCEL_ORG_ID
  Value: tu_org_id_aqui
  
  Name: VERCEL_PROJECT_ID
  Value: prj_8V2CEf88FXnIGzRNW88nnXe6dDAU
  ```

## 🛠️ Cómo Configurar Secretos en GitHub

### Método 1: Interfaz Web de GitHub

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (pestaña superior)
3. En el menú lateral, haz clic en **Secrets and variables** > **Actions**
4. Haz clic en **New repository secret**
5. Ingresa el nombre y valor del secreto
6. Haz clic en **Add secret**

### Método 2: GitHub CLI

```bash
# Instalar GitHub CLI
npm install -g @github/cli

# Autenticarse
gh auth login

# Agregar secretos
gh secret set SNYK_TOKEN --body "tu_token_aqui"
gh secret set TESTNET_WALLET_MNEMONIC --body "tu_mnemonic_aqui"
gh secret set MAINNET_WALLET_MNEMONIC --body "tu_mnemonic_aqui"
gh secret set VERCEL_TOKEN --body "eIhe5OXfe9gq7SeUPHAD0Xpw"
gh secret set VERCEL_WEBHOOK_TOKEN --body "eIhe5OXfe9gq7SeUPHAD0Xpw"
gh secret set VERCEL_ORG_ID --body "tu_org_id_aqui"
gh secret set VERCEL_PROJECT_ID --body "prj_8V2CEf88FXnIGzRNW88nnXe6dDAU"
```

### Método 3: API de GitHub

```bash
# Usando curl
curl -X POST \
  -H "Authorization: token TU_TOKEN_DE_GITHUB" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/panacea-icono/panas-token-estable/actions/secrets/SNYK_TOKEN \
  -d '{"encrypted_value":"valor_encriptado","key_id":"id_de_llave_publica"}'
```

## 🔒 Mejores Prácticas de Seguridad

### Para Wallets

- **Nunca** uses la misma wallet para testnet y mainnet
- **Nunca** commitees mnemónicos en el código
- **Siempre** usa wallets dedicadas para CI/CD
- **Considera** usar wallets multi-signature para mainnet

### Para Tokens de API

- **Rota** los tokens regularmente
- **Usa** permisos mínimos necesarios
- **Monitorea** el uso de los tokens
- **Revoca** tokens comprometidos inmediatamente

### Para Secretos de GitHub

- **Revisa** regularmente qué secretos están configurados
- **Elimina** secretos que ya no se usen
- **Usa** diferentes secretos para diferentes entornos
- **Documenta** el propósito de cada secreto

## 🚨 Troubleshooting

### Error: "Secret not found"

- Verifica que el secreto esté configurado correctamente
- Asegúrate de que el nombre del secreto coincida exactamente
- Verifica que tengas permisos para acceder a los secretos

### Error: "Invalid mnemonic"

- Verifica que el mnemónico tenga exactamente 24 palabras
- Asegúrate de que las palabras estén separadas por espacios
- Verifica que todas las palabras sean válidas según BIP39

### Error: "Insufficient funds"

- Para testnet: Obtén ALGO del faucet de testnet
- Para mainnet: Asegúrate de que la wallet tenga suficientes ALGO

### Error: "Network connection failed"

- Verifica que la red de Algorand esté disponible
- Revisa la configuración de URLs en los archivos de configuración
- Verifica que no haya problemas de firewall

## 📞 Soporte

Si tienes problemas configurando los secretos:

1. **Revisa** la documentación de GitHub Actions
2. **Consulta** los logs del workflow en la pestaña Actions
3. **Contacta** al equipo de desarrollo en [GitHub Issues](https://github.com/panacea-icono/panas-token-estable/issues)
4. **Únete** al [Discord de PANAS](https://discord.gg/panas)

---

**⚠️ ADVERTENCIA**: Los secretos contienen información sensible. Manténlos seguros y
nunca los compartas públicamente.
