# Configuración para Cursor

Esta guía explica cómo conectar tu servidor MCP a Cursor IDE.

## ¿Qué es la Integración con Cursor?

Cursor es un IDE basado en VS Code que tiene integración nativa con Claude AI. Al configurar tu servidor MCP en Cursor, puedes usar tus tools personalizados directamente desde el chat de Claude dentro del IDE.

## Requisitos Previos

1. ✅ Cursor instalado (descarga desde https://cursor.sh)
2. ✅ Tu servidor MCP compilado (`pnpm build`)
3. ✅ Ruta absoluta a tu proyecto

## Pasos de Configuración

### 1. Localiza el Archivo de Configuración

Cursor usa el mismo formato de configuración que Claude Desktop. El archivo se encuentra en:

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

### 2. Crea/Edita el Archivo de Configuración

Si el archivo no existe, créalo. Si existe, edítalo para agregar tu servidor:

```json
{
  "mcpServers": {
    "capital-check-in": {
      "command": "node",
      "args": [
        "/Users/ivansotelo/Documents/CapitalCheckIn/capital-check-in-mcp/build/index.js"
      ]
    }
  }
}
```

**⚠️ IMPORTANTE:** Cambia la ruta por la ruta absoluta a tu proyecto. Para obtener la ruta absoluta:

```bash
# En la terminal, desde el directorio del proyecto
pwd
# Resultado ejemplo: /Users/ivansotelo/Documents/CapitalCheckIn/capital-check-in-mcp
```

Luego usa: `/Users/ivansotelo/Documents/CapitalCheckIn/capital-check-in-mcp/build/index.js`

### 3. Configuración con Variables de Entorno (Opcional)

Si necesitas pasar variables de entorno:

```json
{
  "mcpServers": {
    "capital-check-in": {
      "command": "node",
      "args": [
        "/ruta/absoluta/capital-check-in-mcp/build/index.js"
      ],
      "env": {
        "DEBUG": "true",
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

### 4. Reinicia Cursor

1. Cierra Cursor completamente
2. Abre Cursor nuevamente
3. El servidor MCP se cargará automáticamente

### 5. Verifica la Conexión

Para verificar que tu servidor está conectado:

1. Abre el chat de Claude en Cursor (Cmd/Ctrl + L)
2. Escribe: "¿Qué tools MCP están disponibles?"
3. Claude debería responder mostrando tus tools:
   - `check_in` - Register a capital check-in event
   - `get_status` - Get current capital status and recent check-ins

## Usando los Tools desde Cursor

### Ejemplo 1: Registrar un Check-in

En el chat de Claude en Cursor, escribe:

```
Registra un check-in en "Oficina Central" por un monto de 50000 con la nota "Inversión Q4"
```

Claude usará automáticamente tu tool `check_in` y te mostrará el resultado.

### Ejemplo 2: Consultar Estado

```
¿Cuál es el estado actual de los check-ins?
```

Claude usará el tool `get_status` para obtener la información.

### Ejemplo 3: Usar Resources

```
Muéstrame los check-ins recientes
```

Claude accederá al resource `capital://check-ins/recent`.

## Debugging

### Ver Logs del Servidor

Los logs de tu servidor MCP aparecen en:

**macOS/Linux:**
```bash
tail -f ~/Library/Logs/Cursor/main.log
```

**Windows:**
```
%APPDATA%\Cursor\logs\main.log
```

### Problemas Comunes

#### 1. Servidor No Se Conecta

**Síntoma:** Claude dice que no hay tools disponibles

**Soluciones:**
- Verifica que la ruta en la configuración sea absoluta y correcta
- Asegúrate de que el archivo `build/index.js` existe
- Ejecuta `pnpm build` para recompilar
- Reinicia Cursor completamente

#### 2. Error "Cannot Find Module"

**Síntoma:** El servidor no inicia

**Soluciones:**
- Verifica que `node_modules` esté instalado: `pnpm install`
- Verifica que la ruta incluya `/build/index.js` al final
- Asegúrate de que no haya errores de compilación: `pnpm build`

#### 3. Tools No Aparecen

**Síntoma:** El servidor conecta pero no muestra tools

**Soluciones:**
- Verifica que los tools estén en el array `allTools` en `src/tools/index.ts`
- Recompila: `pnpm build`
- Reinicia Cursor

## Configuración Avanzada

### Múltiples Servidores MCP

Puedes tener varios servidores MCP configurados:

```json
{
  "mcpServers": {
    "capital-check-in": {
      "command": "node",
      "args": ["/ruta/a/capital-check-in-mcp/build/index.js"]
    },
    "otro-servidor": {
      "command": "node",
      "args": ["/ruta/a/otro-servidor/build/index.js"]
    }
  }
}
```

### Usar con pnpm/npm Directamente

Si prefieres usar el gestor de paquetes:

```json
{
  "mcpServers": {
    "capital-check-in": {
      "command": "pnpm",
      "args": [
        "--dir",
        "/ruta/absoluta/capital-check-in-mcp",
        "exec",
        "node",
        "build/index.js"
      ]
    }
  }
}
```

## Desarrollo Activo

Durante el desarrollo:

1. **Terminal 1:** Ejecuta `pnpm dev` (watch mode)
2. **Terminal 2:** Trabaja en Cursor normalmente
3. Cuando cambies código, el watch recompilará automáticamente
4. Reinicia Cursor para cargar los cambios

## Testing vs Producción

- **Testing:** Usa `pnpm inspector` para probar interactivamente
- **Desarrollo:** Usa Cursor con la configuración MCP
- **Producción:** Configura en Claude Desktop

## Script de Ayuda

Para obtener rápidamente la configuración correcta:

```bash
# Desde el directorio del proyecto
echo "{
  \"mcpServers\": {
    \"capital-check-in\": {
      \"command\": \"node\",
      \"args\": [
        \"$(pwd)/build/index.js\"
      ]
    }
  }
}"
```

Copia el output y pégalo en tu archivo de configuración de Cursor.

## Recursos Adicionales

- [Cursor Documentation](https://cursor.sh/docs)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Desktop Configuration](https://modelcontextprotocol.io/quickstart/user)

## Troubleshooting Avanzado

Si nada funciona:

1. Verifica la versión de Node:
   ```bash
   node --version  # Debe ser >= 18.0.0
   ```

2. Prueba ejecutar el servidor manualmente:
   ```bash
   node build/index.js
   ```

3. Si funciona manualmente pero no en Cursor, el problema es la configuración del path

4. Verifica que el archivo de configuración sea JSON válido:
   ```bash
   cat ~/Library/Application\ Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json | python -m json.tool
   ```
