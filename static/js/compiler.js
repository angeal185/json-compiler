var json2html = {
    transform: function(t, n, e) {
        var i = {
                events: [],
                html: ""
            },
            r = {
                events: !1
            };
        if (r = json2html._extend(r, e), void 0 !== n || void 0 !== t) {
            var o = "string" == typeof t ? JSON.parse(t) : t;
            i = json2html._transform(o, n, r)
        }
        return r.events ? i : i.html
    },
    _extend: function(t, n) {
        var e = {};
        for (var i in t) e[i] = t[i];
        for (var i in n) e[i] = n[i];
        return e
    },
    _append: function(t, n) {
        var e = {
            html: "",
            event: []
        };
        return "undefined" != typeof t && "undefined" != typeof n && (e.html = t.html + n.html, e.events = t.events.concat(n.events)), e
    },
    _isArray: function(t) {
        return "[object Array]" === Object.prototype.toString.call(t)
    },
    _transform: function(t, n, e) {
        var i = {
            events: [],
            html: ""
        };
        if (json2html._isArray(t))
            for (var r = t.length, o = 0; r > o; ++o) i = json2html._append(i, json2html._apply(t[o], n, o, e));
        else "object" == typeof t && (i = json2html._append(i, json2html._apply(t, n, void 0, e)));
        return i
    },
    _apply: function(t, n, e, i) {
        var r = {
            events: [],
            html: ""
        };
        if (json2html._isArray(n))
            for (var o = n.length, s = 0; o > s; ++s) r = json2html._append(r, json2html._apply(t, n[s], e, i));
        else if ("object" == typeof n) {
            var a = "<>";
            if (void 0 === n[a] && (a = "tag"), void 0 !== n[a]) {
                var l = json2html._getValue(t, n, a, e);
                r.html += "<" + l;
                var h, f = {
                    events: [],
                    html: ""
                };
                for (var d in n) switch (d) {
                    case "tag":
                    case "<>":
                        break;
                    case "children":
                    case "html":
                        var v = n[d];
                        if (json2html._isArray(v)) f = json2html._append(f, json2html._apply(t, v, e, i));
                        else if ("function" == typeof v) {
                            var u = v.call(t, t, e);
                            "object" == typeof u ? void 0 !== u.html && void 0 !== u.events && (f = json2html._append(f, u)) : "string" == typeof u && (f.html += u)
                        } else h = json2html._getValue(t, n, d, e);
                        break;
                    default:
                        var c = !1;
                        if (d.length > 2 && "on" == d.substring(0, 2).toLowerCase()) {
                            if (i.events) {
                                var m = {
                                        action: n[d],
                                        obj: t,
                                        data: i.eventData,
                                        index: e
                                    },
                                    p = json2html._guid();
                                r.events[r.events.length] = {
                                    id: p,
                                    type: d.substring(2),
                                    data: m
                                }, r.html += " json2html-event-id-" + d.substring(2) + "='" + p + "'"
                            }
                            c = !0
                        }
                        if (!c) {
                            var j = json2html._getValue(t, n, d, e);
                            if (void 0 !== j) {
                                var _;
                                _ = "string" == typeof j ? '"' + j.replace(/"/g, "&quot;") + '"' : j, r.html += " " + d + "=" + _
                            }
                        }
                }
                r.html += ">", h && (r.html += h), r = json2html._append(r, f), r.html += "</" + l + ">"
            }
        }
        return r
    },
    _guid: function() {
        var t = function() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        };
        return t() + t() + "-" + t() + t() + "-" + t() + t()
    },
    _getValue: function(t, n, e, i) {
        var r = "",
            o = n[e],
            s = typeof o;
        if ("function" === s) return o.call(t, t, i);
        if ("string" === s) {
            var a = new json2html._tokenizer([/\$\{([^\}\{]+)\}/], function(n, e, i) {
                return e ? n.replace(i, function(n, e) {
                    for (var i = e.split("."), r = t, o = "", s = i.length, a = 0; s > a; ++a)
                        if (i[a].length > 0) {
                            var l = r[i[a]];
                            if (r = l, null === r || void 0 === r) break
                        }
                    return null !== r && void 0 !== r && (o = r), o
                }) : n
            });
            r = a.parse(o).join("")
        } else r = o;
        return r
    },
    _tokenizer: function(t, n) {
        return this instanceof json2html._tokenizer ? (this.tokenizers = t.splice ? t : [t], n && (this.doBuild = n), this.parse = function(t) {
            this.src = t, this.ended = !1, this.tokens = [];
            do this.next(); while (!this.ended);
            return this.tokens
        }, this.build = function(t, n) {
            t && this.tokens.push(this.doBuild ? this.doBuild(t, n, this.tkn) : t)
        }, this.next = function() {
            var t, n = this;
            n.findMin(), t = n.src.slice(0, n.min), n.build(t, !1), n.src = n.src.slice(n.min).replace(n.tkn, function(t) {
                return n.build(t, !0), ""
            }), n.src || (n.ended = !0)
        }, void(this.findMin = function() {
            var t, n, e = this,
                i = 0;
            for (e.min = -1, e.tkn = ""; void 0 !== (t = e.tokenizers[i++]);) n = e.src[t.test ? "search" : "indexOf"](t), -1 != n && (-1 == e.min || n < e.min) && (e.tkn = t, e.min = n); - 1 == e.min && (e.min = e.src.length)
        })) : new json2html._tokenizer(t, n)
    }
};
! function(t) {
    t.json2html = function(n, e, i) {
        var r = {
            events: !0,
            eventData: {}
        };
        return void 0 !== i && t.extend(r, i), r.events = !0, json2html.transform(n, e, r)
    }, t.fn.json2html = function(n, e, i) {
        if ("undefined" == typeof json2html) return void 0;
        var r = {
            append: !0,
            replace: !1,
            prepend: !1,
            eventData: {}
        };
        return void 0 !== i && t.extend(r, i), r.events = !0, this.each(function() {
            for (var i = json2html.transform(n, e, r), o = t(document.createElement("i")).html(i.html), s = 0; s < i.events.length; s++) {
                var a = i.events[s],
                    l = t(o).find("[json2html-event-id-" + a.type + "='" + a.id + "']");
                if (0 === l.length) throw "jquery.json2html was unable to attach event " + a.id + " to DOM";
                t(l).removeAttr("json2html-event-id-" + a.type), t(l).on(a.type, a.data, function(n) {
                    n.data.event = n, n.data.action.call(t(this), n.data)
                })
            }
            var h = t(o).children();
            r.replace ? t.fn.replaceWith.call(t(this), h) : r.prepend ? t.fn.prepend.call(t(this), h) : t.fn.append.call(t(this), h)
        })
    }
}(jQuery);



