/*
 * grunt-xgettext
 * https://github.com/arendjr/grunt-xgettext
 *
 * Copyright (c) 2013-2014 Arend van Beelen, Speakap BV
 * Licensed under the MIT license.
 */

"use strict";

var _ = require("lodash");

module.exports = function(grunt) {

    function escapeString(string) {

        return '"' + string.replace(/"/g, '\\"') + '"';
    }

    grunt.registerMultiTask("xgettext", "Extracts translatable messages", function() {

        var options = this.options({
            functionName: "tr",
            potFile: "messages.pot",
            processMessage: _.identity
        });

        var translations = {};

        this.files.forEach(function(f) {
            var extractor = require("./extractors/" + f.dest);

            var messages = {};
            f.src.forEach(function(file) {
                _.extend(messages, extractor(file, options));
            });

            _.extend(translations, messages);

            var count = _.keys(messages).length;
            grunt.log.writeln("Extracted " + count + " messages from " + f.dest + " files.");
        });

        var contents = "# Generated by grunt-xgettext on " + (new Date()).toString() + "\n\n";

        contents += _.map(translations, function(definition) {
            var buffer = "msgid " + escapeString(definition.singular) + "\n";
            if (definition.plural) {
                buffer += "msgid_plural " + escapeString(definition.plural) + "\n";
                buffer += "msgstr[0] " + escapeString(definition.message) + "\n";
            } else {
                buffer += "msgstr " + escapeString(definition.message) + "\n";
            }
            return buffer;
        }).join("\n");

        grunt.file.write(options.potFile, contents);

        var count = _.keys(translations).length;
        grunt.log.writeln(count + " messages successfully extracted, " +
            options.potFile + " written.");

    });

};
