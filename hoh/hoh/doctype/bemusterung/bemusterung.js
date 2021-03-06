// Copyright (c) 2020, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bemusterung', {
	refresh: function(frm) {
        if ((!frm.doc.__islocal) && (!frm.doc.item)) {
            frm.add_custom_button(__("Artikel erstellen"), function() {
                frappe.call({
                    method: 'create_item',
                    doc: frm.doc,
                    callback: function(response) {
                       frappe.show_alert( __("Erstellt: ") + response.message );
                       cur_frm.reload_doc();
                    }
                });

            });
        }
        frm.add_custom_button(__("Nadelrechner"), function() {
            nadelrechner(frm, 0.0, 0.0);
        });
	},
    dessin: function(frm) {
        console.log("dessin...");
        frappe.call({
            "method": "frappe.client.get",
            "args": {
                "doctype": "Dessin",
                "name": frm.doc.dessin
            },
            "callback": function(response) {
                var dessin = response.message;

                if (dessin) {
                    cur_frm.set_value('bezeichnung', dessin.bezeichnung);
                    for (var i = 0; i < dessin.stickmaschine.length; i++) {
                        var child = cur_frm.add_child('stickmaschine');
                        frappe.model.set_value(child.doctype, child.name, 'stickmaschine', dessin.stickmaschine[i].stickmaschine);
                    }
                    cur_frm.refresh_field('stickmaschine');
                } 
                
                update_title(frm);
            }
        });
    },
    farbe: function(frm) {
        update_title(frm);
    },
    calculate_composition: function(frm) {
        frappe.call({
            method: 'calculate_composition',
            doc: frm.doc,
            callback: function(response) {
               frappe.show_alert( __("Done!") );
               refresh_field(['komposition']);
            }
        });
    }
});

frappe.ui.form.on('Bemusterung Artikel', {
    item_group: function(frm, cdt, cdn) {
        // if the item is a fabric, fetch width
        if (frappe.model.get_value(cdt, cdn, 'item_group') === "Stoffe") {
            frappe.call({
                'method': 'frappe.client.get',
                'args': {
                    'doctype': 'Item',
                    'name': frappe.model.get_value(cdt, cdn, 'item_code')
                },
                'callback': function(response) {
                    var item = response.message;

                    if (item) {
                        cur_frm.set_value('stoffbreite_von', item.stoffbreite_von);
                        cur_frm.set_value('stoffbreite_bis', item.stoffbreite_bis);
                    } 
                }
            });
        }
    },
    btn_nadelrechner: function(frm, cdt, cdn) {
        var target = {'cdt': cdt, 'cdn': cdn, 'field': 'qty'};
        var current = frappe.model.get_value(cdt, cdn, 'qty');
        var item_group = frappe.model.get_value(cdt, cdn, 'item_group'); /* FIX THIS --> g/m */
        var uom_per_m = frappe.model.get_value(cdt, cdn, 'weight_per_unit');
        if ((item_group === "Garne") || (item_group === "Kordel")) {
            uom_per_m = 0.05;
        } else if (item_group === "Bobinen") {
            uom_per_m = 0.01;
        } else {
            uom_per_m = 1;
        }
        nadelrechner(frm, current, 0.0, target, uom_per_m);
    }
});

function update_title(frm) {
    if ((frm.doc.dessin) && (frm.doc.farbe) && (!frm.doc.title)) {
        cur_frm.set_value('title', frm.doc.dessin + " " + frm.doc.farbe);
    }
}

function nadelrechner(frm, input, output, target=null, uom_per_m=1) {
    var d = new frappe.ui.Dialog({
        'fields': [
            {'fieldname': 'stickrapport', 'label': 'Stickrapport', 'fieldtype': 'Data', 'read_only': 1, 'default': frm.doc.stickrapport},
            {'fieldname': 'uom_per_m', 'label': '(uom) pro m', 'fieldtype': 'Float', 'default': uom_per_m},
            {'fieldname': 'nadel', 'fieldtype': 'Float', 'label': 'x pro Nadel', 'default': input},
            {'fieldname': 'pro_m', 'fieldtype': 'Float', 'label': 'x pro Meter', 'read_only': 1, 'default': output}
        ],
        primary_action: function(){
            d.hide();
            // calculate
            var input = d.get_values().nadel;
            var uom_per_m = d.get_values().uom_per_m;
            var needle_per_m = 114 / 9.1;
            if (frm.doc.stickrapport === "4/4") {
                needle_per_m = 342 / 9.1;
            } else if (frm.doc.stickrapport === "8/4") {
                needle_per_m = 171 / 9.1;
            } else if (frm.doc.stickrapport === "12/4") {
                needle_per_m = 114 / 9.1;
            } else if (frm.doc.stickrapport === "16/4") {
                needle_per_m = 86 / 9.1;
            } else if (frm.doc.stickrapport === "20/4") {
                needle_per_m = 69 / 9.1;
            } else if (frm.doc.stickrapport === "24/4") {
                needle_per_m = 57 / 9.1;
            } else if (frm.doc.stickrapport === "28/4") {
                needle_per_m = 49 / 9.1;
            } else if (frm.doc.stickrapport === "32/4") {
                needle_per_m = 43 / 9.1;
            } else if (frm.doc.stickrapport === "36/4") {
                needle_per_m = 38 / 9.1;
            } else if (frm.doc.stickrapport === "40/4") {
                needle_per_m = 35 / 9.1;
            } else if (frm.doc.stickrapport === "44/4") {
                needle_per_m = 31 / 9.1;
            } else if (frm.doc.stickrapport === "48/4") {
                needle_per_m = 29 / 9.1;
            } else if (frm.doc.stickrapport === "52/4") {
                needle_per_m = 26 / 9.1;
            } else if (frm.doc.stickrapport === "56/4") {
                needle_per_m = 24 / 9.1;
            } else if (frm.doc.stickrapport === "60/4") {
                needle_per_m = 22 / 9.1;
            } else if (frm.doc.stickrapport === "64/4") {
                needle_per_m = 21 / 9.1;
            } else if (frm.doc.stickrapport === "68/4") {
                needle_per_m = 20 / 9.1;
            } else if (frm.doc.stickrapport === "72/4") {
                needle_per_m = 19 / 9.1;
            } else if (frm.doc.stickrapport === "76/4") {
                needle_per_m = 18 / 9.1;
            } else if (frm.doc.stickrapport === "80/4") {
                needle_per_m = 17 / 9.1;
            } else if (frm.doc.stickrapport === "84/4") {
                needle_per_m = 16 / 9.1;
            } else if (frm.doc.stickrapport === "88/4") {
                needle_per_m = 15 / 9.1;
            } else if (frm.doc.stickrapport === "92/4") {
                needle_per_m = 14 / 9.1;
            } else if (frm.doc.stickrapport === "96/4") {
                needle_per_m = 14 / 9.1;
            } else if (frm.doc.stickrapport === "100/4") {
                needle_per_m = 13 / 9.1;
            } else if (frm.doc.stickrapport === "104/4") {
                needle_per_m = 13 / 9.1;
            } else {
                frappe.msgprint("Unbekannter Rapport");
            }
            output = input * needle_per_m * uom_per_m;
            // if there is a target, fill value
            if (target) {
                frappe.model.set_value(target.cdt, target.cdn, target.field, output);
            } else {
                // repeat
                nadelrechner(frm, input, output);
            }
        },
        primary_action_label: __('OK'),
        title: __("Nadelrechner")
    });
    d.show();
}
