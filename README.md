# ApexOS Config Helper

Visual Studio Code extension for editing ApexOS YAML configuration:
schema validation, completion for entity ids / services / areas / devices,
hover documentation, go-to-definition across `!include` files, template
rendering, and remote reload/restart commands against a live ApexOS core
instance.

## Connecting to ApexOS

The extension talks to the core websocket/REST API. Credentials are resolved
in this order:

1. VS Code SecretStorage (set via the `ApexOS: Manage authentication` command)
2. Settings: `apexos.hostUrl` (URL); tokens are migrated out of settings into
   SecretStorage on first activation
3. Environment: `APEX_SERVER` / `APEX_TOKEN`
4. Legacy environment: `HASS_SERVER` / `HASS_TOKEN` (pre-fork names, still
   honored; the `APEX_*` names win when both are set)
5. `SUPERVISOR_TOKEN` (managed installs: URL defaults to
   `http://supervisor/core`)

## Settings

Section: `apexos.*`

- `apexos.ignoreCertificates` - allow invalid TLS certificates
- `apexos.disableAutomaticFileAssociation` - do not auto-associate YAML files
- `apexos.autoRenderTemplates` - render templates on hover

Legacy compatibility: values still stored under the pre-fork section
(`vscode-home-assistant.*`) are read as a fallback, and stored
tokens/instance URLs are migrated to the new location on activation. Boolean
settings should be moved to `apexos.*` (declared defaults of the new section
take precedence).

## Development

- `npm install`
- `npm run compile` - build the language service, generate schemas, build the
  extension
- `npm test` - run the extension test suite
- `npx @vscode/vsce package` - build the .vsix

License: MIT (see LICENSE.md).
