import { BaseExtension } from "./BaseExtension";

export class SampleExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
    }
    load() {
        super.load();
        console.log("SampleExtension loaded.");
        return true;
    }

    unload() {
        super.unload();
        console.log("SampleExtension unloaded.");
        return true;
    }

    onToolbarCreated() {
        this._button = this.createToolbarButton(
            'sample-button',
            'https://img.icons8.com/?size=100&id=aIYDmrSk6X13&format=png&color=000000',
            'Sample Extension Button'
        )
        this._button.onClick = (e) => {
            console.log("SampleExtension button clicked.");
            this.viewer.setLightPreset(15);
        };
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        console.log("SampleExtension: Model loaded.");
    }

    onSelectionChanged(model, dbids) {
        super.onSelectionChanged(model, dbids);
        console.log("SampleExtension: Selection changed", dbids);
    }

    onIsolationChanged(model, dbids) {
        super.onIsolationChanged(model, dbids);
        console.log("SampleExtension: Isolation changed", dbids);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('SampleExtension', SampleExtension);