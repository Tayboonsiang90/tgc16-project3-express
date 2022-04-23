// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
var widgets = require("forms").widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf("form-control") === -1) {
        object.widget.classes.push("form-control");
    }

    var validationclass = object.value && !object.error ? "is-valid" : "";
    validationclass = object.error ? "is-invalid" : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + "</div>" : "";

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + "</div>";
};

const createLoginForm = () => {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label", "mt-3"],
            },
        }),
    });
};

const createCountryForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
    });
};

const createMediaForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
    });
};

const createTagForm = () => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
    });
};

const createVaultForm = (countries) => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        address: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        postal: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            validators: [validators.integer()],
        }),
        country_id: fields.string({
            label: "Country",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.select(),
            choices: countries,
        }),
    });
};

const createArtistForm = (countries) => {
    return forms.create({
        first_name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        last_name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        profile: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        country_id: fields.string({
            label: "Country",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.select(),
            choices: countries,
        }),
    });
};

const createArtForm = (vaults, artists, medias, tags) => {
    return forms.create({
        name: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
        }),
        year: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            validators: [validators.integer()],
        }),
        vault_id: fields.string({
            label: "Vault",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.select(),
            choices: vaults,
        }),
        artist_id: fields.string({
            label: "Artist",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.select(),
            choices: artists,
        }),
        medias: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.multipleSelect(),
            choices: medias,
        }),
        tags: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ["form-label"],
            },
            widget: widgets.multipleSelect(),
            choices: tags,
        }),
    });
};

module.exports = { bootstrapField, createLoginForm, createCountryForm, createMediaForm, createTagForm, createVaultForm, createArtistForm, createArtForm };
