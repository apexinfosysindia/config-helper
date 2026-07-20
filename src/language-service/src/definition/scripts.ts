import { Definition, Location } from "vscode-languageserver-protocol";
import { ApexOSConfiguration } from "../apexConfig/apexConfig";
import { DefinitionProvider } from "./definition";

export class ScriptDefinitionProvider implements DefinitionProvider {
  constructor(private apexConfig: ApexOSConfiguration) {}

  public onDefinition = async (
    line: string,
    _uri: string,
  ): Promise<Definition[]> => {
    const matches = /(.*)(script\.([\S]*))([\s]*)*(.*)/.exec(line);
    if (!matches || matches.length !== 6) {
      return [];
    }
    const scripts = await this.apexConfig.getScripts();
    const scriptName = matches[3].replace(":", ""); // might be possible in regex!?
    const ourScript = scripts[scriptName];
    if (!ourScript) {
      return [];
    }
    return [
      Location.create(ourScript.fileUri, {
        start: { line: ourScript.start[0], character: ourScript.start[1] },
        end: { line: ourScript.end[0], character: ourScript.end[1] },
      }),
    ];
  };
}
