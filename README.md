# Don Lomito · Carta digital

Carta online con pedidos por WhatsApp y panel de administrador, publicada con GitHub Pages.

- **Carta:** https://claudevideosai-lgtm.github.io/don-lomito/
- **Panel:** https://claudevideosai-lgtm.github.io/don-lomito/admin/

## Cómo funciona

- Todo vive en la carpeta `docs/`, que es lo que publica GitHub Pages.
- Los productos, precios, secciones y datos del local están en `docs/menu.json`.
- El panel (`docs/admin/`) guarda los cambios directamente en este repositorio usando una llave de acceso de GitHub. Cada cambio se publica solo en ~1 minuto.
- Las fotos que se suben desde el panel quedan en `docs/fotos/u/`.

## Llave de acceso para el panel

1. Entrá a https://github.com/settings/personal-access-tokens/new
2. **Repository access:** *Only select repositories* → `don-lomito`.
3. **Permissions → Contents:** *Read and write*.
4. Generá la llave y pegala en el panel. Si la perdés o vence, creá otra.
