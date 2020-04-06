// Copyright (c) 2020, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Dessin', {
	refresh: function(frm) {
        if (frm.doc.__islocal) {
            prepare_details(frm);
        }
	},
    before_save: function(frm) {
        var gesamt_meter = 0; // schnurmeter + pailletenmeter + stickmeter
        for (var i = 0; i < frm.doc.details.length; i++) {
            var sum = frm.doc.details[i].anfang
                    + (frm.doc.details[i].rang * frm.doc.anzahl_rang)
                    + frm.doc.details[i].schluss;
            frappe.model.set_value(cur_frm.doc.details[i].doctype, 
                    cur_frm.doc.details[i].name, 'gesamt', sum);
            if (frm.doc.details[i].bezeichnung === "Stickhöhe") {
                cur_frm.set_value('stickhoehe', sum);
            } else if (frm.doc.details[i].bezeichnung === "Paillettenmeter") {
                gesamt_meter += sum;
            } else if (frm.doc.details[i].bezeichnung === "Schnurmeter") {
                gesamt_meter += sum;
            } else if (frm.doc.details[i].bezeichnung === "Stickmeter") {
                gesamt_meter += sum;
            } else if (frm.doc.details[i].bezeichnung === "Kordelmeter") {
                gesamt_meter += sum;
            }
        }
        cur_frm.set_value('gesamtmeter', gesamt_meter);
    },
    dessinnummer: function(frm) {
        if (frm.doc.dessinnummer) {
            cur_frm.set_value('dessintitel', frm.doc.dessinnummer);
        }
    }
});

function prepare_details(frm) {
    var child = cur_frm.add_child('details');
    frappe.model.set_value(child.doctype, child.name, 'bezeichnung', 'Stickhöhe');
    child = cur_frm.add_child('details');
    frappe.model.set_value(child.doctype, child.name, 'bezeichnung', 'Stickmeter');
    child = cur_frm.add_child('details');
    frappe.model.set_value(child.doctype, child.name, 'bezeichnung', 'Paillettenmeter');
    child = cur_frm.add_child('details');
    frappe.model.set_value(child.doctype, child.name, 'bezeichnung', 'Schnurmeter');
    child = cur_frm.add_child('details');
    frappe.model.set_value(child.doctype, child.name, 'bezeichnung', 'Paillettenanzahl');
    
    cur_frm.refresh_field('details');
}
