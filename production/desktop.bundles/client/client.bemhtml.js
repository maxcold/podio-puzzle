var BEMHTML = function() {
  var cache,
      xjst = (function(exports) {
    !function() {
        var BEM_ = {}, toString = Object.prototype.toString, SHORT_TAGS = {
            area: 1,
            base: 1,
            br: 1,
            col: 1,
            command: 1,
            embed: 1,
            hr: 1,
            img: 1,
            input: 1,
            keygen: 1,
            link: 1,
            meta: 1,
            param: 1,
            source: 1,
            wbr: 1
        };
        (function(BEM, undefined) {
            var MOD_DELIM = "_", ELEM_DELIM = "__", NAME_PATTERN = "[a-zA-Z0-9-]+";
            function buildModPostfix(modName, modVal, buffer) {
                buffer.push(MOD_DELIM, modName, MOD_DELIM, modVal);
            }
            function buildBlockClass(name, modName, modVal, buffer) {
                buffer.push(name);
                modVal && buildModPostfix(modName, modVal, buffer);
            }
            function buildElemClass(block, name, modName, modVal, buffer) {
                buildBlockClass(block, undefined, undefined, buffer);
                buffer.push(ELEM_DELIM, name);
                modVal && buildModPostfix(modName, modVal, buffer);
            }
            BEM.INTERNAL = {
                NAME_PATTERN: NAME_PATTERN,
                MOD_DELIM: MOD_DELIM,
                ELEM_DELIM: ELEM_DELIM,
                buildModPostfix: function(modName, modVal, buffer) {
                    var res = buffer || [];
                    buildModPostfix(modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildClass: function(block, elem, modName, modVal, buffer) {
                    var typeOf = typeof modName;
                    if (typeOf == "string") {
                        if (typeof modVal != "string") {
                            buffer = modVal;
                            modVal = modName;
                            modName = elem;
                            elem = undefined;
                        } else {
                            undefined;
                        }
                    } else {
                        if (typeOf != "undefined") {
                            buffer = modName;
                            modName = undefined;
                        } else {
                            if (elem && typeof elem != "string") {
                                buffer = elem;
                                elem = undefined;
                            } else {
                                undefined;
                            }
                        }
                    }
                    if (!(elem || modName || buffer)) {
                        return block;
                    } else {
                        undefined;
                    }
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, modName, modVal, res) : buildBlockClass(block, modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildModsClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    if (mods) {
                        var modName;
                        for (modName in mods) {
                            if (!mods.hasOwnProperty(modName)) {
                                continue;
                            } else {
                                undefined;
                            }
                            var modVal = mods[modName];
                            if (modVal == null) {
                                continue;
                            } else {
                                undefined;
                            }
                            modVal = mods[modName] + "";
                            if (!modVal) {
                                continue;
                            } else {
                                undefined;
                            }
                            res.push(" ");
                            if (elem) {
                                buildElemClass(block, elem, modName, modVal, res);
                            } else {
                                buildBlockClass(block, modName, modVal, res);
                            }
                        }
                    } else {
                        undefined;
                    }
                    return buffer ? res : res.join("");
                },
                buildClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, undefined, undefined, res) : buildBlockClass(block, undefined, undefined, res);
                    this.buildModsClasses(block, elem, mods, buffer);
                    return buffer ? res : res.join("");
                }
            };
        })(BEM_);
        var buildEscape = function() {
            var ts = {
                '"': "&quot;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;"
            }, f = function(t) {
                return ts[t] || t;
            };
            return function(r) {
                r = new RegExp(r, "g");
                return function(s) {
                    return ("" + s).replace(r, f);
                };
            };
        }();
        function BEMContext(context, apply_) {
            this.ctx = context;
            this.apply = apply_;
            this._buf = [];
            this._ = this;
            this._start = true;
            this._mode = "";
            this._listLength = 0;
            this._notNewList = false;
            this.position = 0;
            this.block = undefined;
            this.elem = undefined;
            this.mods = undefined;
            this.elemMods = undefined;
        }
        BEMContext.prototype.isArray = function isArray(obj) {
            return toString.call(obj) === "[object Array]";
        };
        BEMContext.prototype.isSimple = function isSimple(obj) {
            var t = typeof obj;
            return t === "string" || t === "number" || t === "boolean";
        };
        BEMContext.prototype.isShortTag = function isShortTag(t) {
            return SHORT_TAGS.hasOwnProperty(t);
        };
        BEMContext.prototype.extend = function extend(o1, o2) {
            if (!o1 || !o2) {
                return o1 || o2;
            } else {
                undefined;
            }
            var res = {}, n;
            for (n in o1) {
                o1.hasOwnProperty(n) && (res[n] = o1[n]);
            }
            for (n in o2) {
                o2.hasOwnProperty(n) && (res[n] = o2[n]);
            }
            return res;
        };
        BEMContext.prototype.identify = function() {
            var cnt = 0, id = BEM_["__id"] = +(new Date), expando = "__" + id, get = function() {
                return "uniq" + id + ++cnt;
            };
            return function(obj, onlyGet) {
                if (!obj) {
                    return get();
                } else {
                    undefined;
                }
                if (onlyGet || obj[expando]) {
                    return obj[expando];
                } else {
                    return obj[expando] = get();
                }
            };
        }();
        BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
        BEMContext.prototype.attrEscape = buildEscape('["&<>]');
        BEMContext.prototype.BEM = BEM_;
        BEMContext.prototype.isFirst = function isFirst() {
            return this.position === 1;
        };
        BEMContext.prototype.isLast = function isLast() {
            return this.position === this._listLength;
        };
        BEMContext.prototype.generateId = function generateId() {
            return this.identify(this.ctx);
        };
        exports.apply = BEMContext.apply = function _apply() {
            var ctx = new BEMContext(this, apply);
            ctx.apply();
            return ctx._buf.join("");
        };
    }();
    return exports;
    exports.apply = apply;
    function apply() {
        var __t = this._mode;
        if (__t === "attrs") {
            var __t = this.block;
            if (__t === "list") {
                if (this.elem === "item") {
                    return {
                        href: this.ctx.url
                    };
                    return;
                } else {
                    return $19.call(this);
                }
            } else if (__t === "organization") {
                if (this.elem === "icon") {
                    return this.ctx.src ? {
                        style: "background-image: url(" + this.ctx.src + ");"
                    } : "";
                    return;
                } else {
                    return $19.call(this);
                }
            } else if (__t === "space-switcher-filter") {
                if (this.elem === "input") {
                    return {
                        type: "text",
                        value: "",
                        placeholder: "Search for spaces"
                    };
                    return;
                } else {
                    return $19.call(this);
                }
            } else {
                return $19.call(this);
            }
        } else if (__t === "tag") {
            var __t = this.block;
            if (__t === "list") {
                if (this.elem === "item") {
                    return "a";
                    return;
                } else {
                    return $32.call(this);
                }
            } else if (__t === "space-switcher-filter") {
                if (this.elem === "input") {
                    return "input";
                    return;
                } else {
                    return $32.call(this);
                }
            } else {
                return $32.call(this);
            }
        } else if (__t === "content") {
            if (this.block === "space-switcher-filter") {
                if (this.elem === "spaces") {
                    return {
                        elem: "spaces-inner",
                        content: this.ctx.content
                    };
                    return;
                } else {
                    return $40.call(this);
                }
            } else {
                return $40.call(this);
            }
        } else if (__t === "mix" || __t === "bem" || __t === "jsAttr" || __t === "js" || __t === "cls") {
            return undefined;
            return;
        } else {
            if (!this.ctx === false) {
                if (!this.ctx.link === false) {
                    if (!!this._.isSimple(this.ctx) === false) {
                        return $55.call(this);
                    } else {
                        return $60.call(this);
                    }
                } else {
                    return $60.call(this);
                }
            } else {
                return $60.call(this);
            }
        }
    }
    function $19() {
        return undefined;
        return;
    }
    function $32() {
        return undefined;
        return;
    }
    function $40() {
        return this.ctx.content;
        return;
    }
    function $55() {
        var __this = this;
        var __r52, __r53;
        function _$6follow() {
            if (this.ctx.link === "no-follow") {
                return undefined;
            } else {
                undefined;
            }
            var data = this._links[this.ctx.link];
            return "", __r52 = this.ctx, this.ctx = data, __r53 = apply.call(__this), this.ctx = __r52, "", __r53;
        }
        if (!cache || !this._cacheLog) {
            return _$6follow.call(this);
        } else {
            undefined;
        }
        var _$6contents = this._buf.slice(this._cachePos).join("");
        this._cachePos = this._buf.length;
        this._cacheLog.push(_$6contents, {
            log: this._localLog.slice(),
            link: this.ctx.link
        });
        var _$6res = _$6follow.call(this);
        this._cachePos = this._buf.length;
        return _$6res;
        return;
    }
    function $60() {
        if (!cache === false) {
            if (!this.ctx === false) {
                if (!this.ctx.cache === false) {
                    return $64.call(this);
                } else {
                    return $69.call(this);
                }
            } else {
                return $69.call(this);
            }
        } else {
            return $69.call(this);
        }
    }
    function $64() {
        var __this = this;
        var _$5cached;
        function _$5setProperty(obj, key, value) {
            if (key.length === 0) {
                return undefined;
            } else {
                undefined;
            }
            if (Array.isArray(value)) {
                var target = obj;
                for (var i = 0; i < value.length - 1; i++) {
                    target = target[value[i]];
                }
                value = target[value[i]];
            } else {
                undefined;
            }
            var host = obj, previous;
            for (var i = 0; i < key.length - 1; i++) {
                host = host[key[i]];
            }
            previous = host[key[i]];
            host[key[i]] = value;
            return previous;
        }
        if (_$5cached = cache.get(this.ctx.cache)) {
            for (var _$5i = 0; _$5i < _$5cached.log.length; _$5i++) {
                if (typeof _$5cached.log[_$5i] === "string") {
                    this._buf.push(_$5cached.log[_$5i]);
                    continue;
                } else {
                    undefined;
                }
                var _$5log = _$5cached.log[_$5i], _$5reverseLog;
                _$5reverseLog = _$5log.log.map(function(entry) {
                    return {
                        key: entry[0],
                        value: _$5setProperty(this, entry[0], entry[1])
                    };
                }, this).reverse();
                {
                    "";
                    var __r42 = this.ctx, __r43 = __r42.cache;
                    __r42.cache = null;
                    var __r44 = this._cacheLog;
                    this._cacheLog = null;
                    var __r45 = this.ctx, __r46 = __r45.link;
                    __r45.link = _$5log.link;
                    apply.call(__this);
                    __r42.cache = __r43;
                    this._cacheLog = __r44;
                    __r45.link = __r46;
                    "";
                }
                undefined;
                _$5reverseLog.forEach(function(entry) {
                    _$5setProperty(this, entry.key, entry.value);
                }, this);
            }
            return _$5cached.res;
        } else {
            undefined;
        }
        var _$5cacheLog = [], _$5res;
        {
            "";
            var __r47 = this.ctx, __r48 = __r47.cache;
            __r47.cache = null;
            var __r49 = this._cachePos;
            this._cachePos = this._buf.length;
            var __r50 = this._cacheLog;
            this._cacheLog = _$5cacheLog;
            var __r51 = this._localLog;
            this._localLog = [];
            {
                _$5res = apply.call(__this);
                var _$5tail = this._buf.slice(this._cachePos).join("");
                if (_$5tail) {
                    _$5cacheLog.push(_$5tail);
                } else {
                    undefined;
                }
            }
            __r47.cache = __r48;
            this._cachePos = __r49;
            this._cacheLog = __r50;
            this._localLog = __r51;
            "";
        }
        cache.set(this.ctx.cache, {
            log: _$5cacheLog,
            res: _$5res
        });
        return _$5res;
        return;
    }
    function $69() {
        if (this._mode === "default") {
            return $71.call(this);
        } else {
            if (!this._.isSimple(this.ctx) === false) {
                if (!!this._mode === false) {
                    this._listLength--;
                    var _$3ctx = this.ctx;
                    (_$3ctx && _$3ctx !== true || _$3ctx === 0) && this._buf.push(_$3ctx);
                    return;
                } else {
                    return $78.call(this);
                }
            } else {
                return $78.call(this);
            }
        }
    }
    function $71() {
        var __this = this;
        var __r20, __r8, __r12, __r13, __r14, __r15, __r16, __r17, __r18, __r19, __r9, __r21, __r22, __r23, __r26, __r27, __r28, __r29, __r30, __r31;
        var _$4_this = this, _$4BEM_ = _$4_this.BEM, _$4v = this.ctx, _$4buf = this._buf, _$4tag;
        _$4tag = ("", __r8 = this._mode, this._mode = "tag", __r9 = apply.call(__this), this._mode = __r8, "", __r9);
        typeof _$4tag != "undefined" || (_$4tag = _$4v.tag);
        typeof _$4tag != "undefined" || (_$4tag = "div");
        if (_$4tag) {
            var _$4jsParams, _$4js;
            if (this.block && _$4v.js !== false) {
                _$4js = ("", __r12 = this._mode, this._mode = "js", __r13 = apply.call(__this), this._mode = __r12, "", __r13);
                _$4js = _$4js ? this._.extend(_$4v.js, _$4js === true ? {} : _$4js) : _$4v.js === true ? {} : _$4v.js;
                _$4js && ((_$4jsParams = {})[_$4BEM_.INTERNAL.buildClass(this.block, _$4v.elem)] = _$4js);
            } else {
                undefined;
            }
            _$4buf.push("<", _$4tag);
            var _$4isBEM = ("", __r14 = this._mode, this._mode = "bem", __r15 = apply.call(__this), this._mode = __r14, "", __r15);
            typeof _$4isBEM != "undefined" || (_$4isBEM = typeof _$4v.bem != "undefined" ? _$4v.bem : _$4v.block || _$4v.elem);
            var _$4cls = ("", __r16 = this._mode, this._mode = "cls", __r17 = apply.call(__this), this._mode = __r16, "", __r17);
            _$4cls || (_$4cls = _$4v.cls);
            var _$4addJSInitClass = _$4v.block && _$4jsParams;
            if (_$4isBEM || _$4cls) {
                _$4buf.push(' class="');
                if (_$4isBEM) {
                    _$4BEM_.INTERNAL.buildClasses(this.block, _$4v.elem, _$4v.elemMods || _$4v.mods, _$4buf);
                    var _$4mix = ("", __r18 = this._mode, this._mode = "mix", __r19 = apply.call(__this), this._mode = __r18, "", __r19);
                    _$4v.mix && (_$4mix = _$4mix ? _$4mix.concat(_$4v.mix) : _$4v.mix);
                    if (_$4mix) {
                        var _$4visited = {};
                        function _$4visitedKey(block, elem) {
                            return (block || "") + "__" + (elem || "");
                        }
                        _$4visited[_$4visitedKey(this.block, this.elem)] = true;
                        if (!this._.isArray(_$4mix)) {
                            _$4mix = [ _$4mix ];
                        } else {
                            undefined;
                        }
                        for (var _$4i = 0; _$4i < _$4mix.length; _$4i++) {
                            var _$4mixItem = _$4mix[_$4i], _$4hasItem = _$4mixItem.block || _$4mixItem.elem, _$4block = _$4mixItem.block || _$4mixItem._block || _$4_this.block, _$4elem = _$4mixItem.elem || _$4mixItem._elem || _$4_this.elem;
                            _$4hasItem && _$4buf.push(" ");
                            _$4BEM_.INTERNAL[_$4hasItem ? "buildClasses" : "buildModsClasses"](_$4block, _$4mixItem.elem || _$4mixItem._elem || (_$4mixItem.block ? undefined : _$4_this.elem), _$4mixItem.elemMods || _$4mixItem.mods, _$4buf);
                            if (_$4mixItem.js) {
                                (_$4jsParams || (_$4jsParams = {}))[_$4BEM_.INTERNAL.buildClass(_$4block, _$4mixItem.elem)] = _$4mixItem.js === true ? {} : _$4mixItem.js;
                                _$4addJSInitClass || (_$4addJSInitClass = _$4block && !_$4mixItem.elem);
                            } else {
                                undefined;
                            }
                            if (_$4hasItem && !_$4visited[_$4visitedKey(_$4block, _$4elem)]) {
                                _$4visited[_$4visitedKey(_$4block, _$4elem)] = true;
                                var _$4nestedMix = ("", __r20 = this.block, this.block = _$4block, __r21 = this.elem, this.elem = _$4elem, __r22 = this._mode, this._mode = "mix", __r23 = apply.call(__this), this.block = __r20, this.elem = __r21, this._mode = __r22, "", __r23);
                                if (_$4nestedMix) {
                                    for (var _$4j = 0; _$4j < _$4nestedMix.length; _$4j++) {
                                        var _$4nestedItem = _$4nestedMix[_$4j];
                                        if (!_$4nestedItem.block && !_$4nestedItem.elem || !_$4visited[_$4visitedKey(_$4nestedItem.block, _$4nestedItem.elem)]) {
                                            _$4nestedItem._block = _$4block;
                                            _$4nestedItem._elem = _$4elem;
                                            _$4mix.splice(_$4i + 1, 0, _$4nestedItem);
                                        } else {
                                            undefined;
                                        }
                                    }
                                } else {
                                    undefined;
                                }
                            } else {
                                undefined;
                            }
                        }
                    } else {
                        undefined;
                    }
                } else {
                    undefined;
                }
                _$4cls && _$4buf.push(_$4isBEM ? " " : "", _$4cls);
                _$4addJSInitClass && _$4buf.push(" i-bem");
                _$4buf.push('"');
            } else {
                undefined;
            }
            if (_$4jsParams) {
                var _$4jsAttr = ("", __r26 = this._mode, this._mode = "jsAttr", __r27 = apply.call(__this), this._mode = __r26, "", __r27);
                _$4buf.push(" ", _$4jsAttr || "onclick", '="return ', this._.attrEscape(JSON.stringify(_$4jsParams)), '"');
            } else {
                undefined;
            }
            var _$4attrs = ("", __r28 = this._mode, this._mode = "attrs", __r29 = apply.call(__this), this._mode = __r28, "", __r29);
            _$4attrs = this._.extend(_$4attrs, _$4v.attrs);
            if (_$4attrs) {
                var _$4name;
                for (_$4name in _$4attrs) {
                    if (_$4attrs[_$4name] === undefined) {
                        continue;
                    } else {
                        undefined;
                    }
                    _$4buf.push(" ", _$4name, '="', this._.attrEscape(_$4attrs[_$4name]), '"');
                }
            } else {
                undefined;
            }
        } else {
            undefined;
        }
        if (this._.isShortTag(_$4tag)) {
            _$4buf.push("/>");
        } else {
            _$4tag && _$4buf.push(">");
            var _$4content = ("", __r30 = this._mode, this._mode = "content", __r31 = apply.call(__this), this._mode = __r30, "", __r31);
            if (_$4content || _$4content === 0) {
                var _$4isBEM = this.block || this.elem;
                {
                    "";
                    var __r32 = this._notNewList;
                    this._notNewList = false;
                    var __r33 = this.position;
                    this.position = _$4isBEM ? 1 : this.position;
                    var __r34 = this._listLength;
                    this._listLength = _$4isBEM ? 1 : this._listLength;
                    var __r35 = this.ctx;
                    this.ctx = _$4content;
                    var __r36 = this._mode;
                    this._mode = "";
                    apply.call(__this);
                    this._notNewList = __r32;
                    this.position = __r33;
                    this._listLength = __r34;
                    this.ctx = __r35;
                    this._mode = __r36;
                    "";
                }
                undefined;
            } else {
                undefined;
            }
            _$4tag && _$4buf.push("</", _$4tag, ">");
        }
        return;
    }
    function $78() {
        if (!!this._mode === false) {
            if (!!this.ctx === false) {
                this._listLength--;
                return;
            } else {
                return $84.call(this);
            }
        } else {
            return $84.call(this);
        }
    }
    function $84() {
        var __this = this;
        if (!this._.isArray(this.ctx) === false) {
            if (!!this._mode === false) {
                var _$1v = this.ctx, _$1l = _$1v.length, _$1i = 0, _$1prevPos = this.position, _$1prevNotNewList = this._notNewList;
                if (_$1prevNotNewList) {
                    this._listLength += _$1l - 1;
                } else {
                    this.position = 0;
                    this._listLength = _$1l;
                }
                this._notNewList = true;
                while (_$1i < _$1l) {
                    "";
                    var __r7 = this.ctx;
                    this.ctx = _$1v[_$1i++];
                    apply.call(__this);
                    this.ctx = __r7;
                    "";
                }
                undefined;
                _$1prevNotNewList || (this.position = _$1prevPos);
                return;
            } else {
                return $90.call(this);
            }
        } else {
            return $90.call(this);
        }
    }
    function $90() {
        if (!true === false) {
            if (!!this._mode === false) {
                return $93.call(this);
            } else {
                return $e.call(this);
            }
        } else {
            return $e.call(this);
        }
    }
    function $93() {
        var __this = this;
        var _$0vBlock = this.ctx.block, _$0vElem = this.ctx.elem, _$0block = this._currBlock || this.block;
        this.ctx || (this.ctx = {});
        {
            "";
            var __r0 = this._mode;
            this._mode = "default";
            var __r1 = this._links;
            this._links = this.ctx.links || this._links;
            var __r2 = this.block;
            this.block = _$0vBlock || (_$0vElem ? _$0block : undefined);
            var __r3 = this._currBlock;
            this._currBlock = _$0vBlock || _$0vElem ? undefined : _$0block;
            var __r4 = this.elem;
            this.elem = this.ctx.elem;
            var __r5 = this.mods;
            this.mods = (_$0vBlock ? this.ctx.mods : this.mods) || {};
            var __r6 = this.elemMods;
            this.elemMods = this.ctx.elemMods || {};
            {
                this.block || this.elem ? this.position = (this.position || 0) + 1 : this._listLength--;
                apply.call(__this);
                undefined;
            }
            this._mode = __r0;
            this._links = __r1;
            this.block = __r2;
            this._currBlock = __r3;
            this.elem = __r4;
            this.mods = __r5;
            this.elemMods = __r6;
            "";
        }
        return;
    }
    function $e() {
        throw new Error;
        return;
    }
    return exports;
})(typeof exports === "undefined" ? {} : exports);;
  return function(options) {
    if (!options) options = {};
    cache = options.cache;
    return xjst.apply.call(
[this]
    );
  };
}();
typeof exports === "undefined" || (exports.BEMHTML = BEMHTML);