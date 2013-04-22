BEM.DOM.decl("space-switcher-filter",{onSetMod:{js:function(){var e=this,t=e.findElem("spaces-inner");$.when(e.loadData()).then(function(){var n=e._getData(),r=BEM.blocks.organization._build(n),i=BEMHTML.apply(r);t.append(i),e._initFields(),e._bindToMouseEvents()})},focused:{yes:function(){var e=this._getInput();e.focus(),this.bindTo("keypress",function(e){this._onKeyPress(e)}).bindTo("keydown",function(e){this._onKeyDown(e)}).bindTo("keyup",function(e){this._onKeyUp(e)})},"":function(){this.unbindFrom("keypress keydown keyup")}}},onElemSetMod:{item:{matched:{yes:function(e){e.html(this._highlight(e.text()))},"":function(e){var t=e.html().replace("<strong>","").replace("</strong>","");e.html(t)}}}},_data:null,_items:null,_navItems:null,_input:null,_organizations:null,_spaceSwitcher:null,_curItemIndex:-1,_rowHeight:23,_query:"",_initFields:function(){this._items=this.findElem("item"),this._navItems=this._items,this._input=this.findElem("input"),this._organizations=this.findBlocksInside("organization"),this._spaceSwitcher=this.findBlockOutside("space-switcher"),this._rowHeight=this._getRowHeight(),this._curItemIndex=0},_bindToMouseEvents:function(){var e=this,t=e._getItems();e.bindTo(t,{mouseover:function(t){e._onEnterItem(t.data.domElem)},mouseout:function(t){e._onLeaveItem(t.data.domElem)}})},_onEnterItem:function(e,t){var n=this._curItemIndex,r=this._getNavItems();n>-1&&this.delMod(r.eq(n),"state"),n=this._getItemIndex(e),n>-1&&this.setMod(r.eq(this._curItemIndex=n),"state","selected"),t&&this._scrollToCurrent()},_onLeaveItem:function(e){var t=this._curItemIndex,n=this._getNavItems();t>-1&&t===this._getItemIndex(e)&&(this.delMod(n.eq(t),"state"),this._curItemIndex=-1)},_getItems:function(){return this._items},_getNavItems:function(){return this._navItems},_updateNavItems:function(){var e=this,t=e._getOrganizations(),n=e._getItems(),r=[];t.forEach(function(t){var i=$(t.domElem);t.hasMod("hidden","yes")?r=e.findElem(i,"item"):r=e.findElem(i,"item","hidden","yes"),n=n.not(r)}),this._navItems=n},_getInput:function(){return this._input},_getOrganizations:function(){return this._organizations},_getSpaceSwitcher:function(){return this._spaceSwitcher},_getRowHeight:function(){var e=this._getItems();return e.outerHeight()},_getItemIndex:function(e){var t=this._getNavItems();return $.inArray(e.get(0),t)},_onKeyPress:function(e){var t=this._getNavItems();e.keyCode===13&&(e.preventDefault(),this._curItemIndex>-1&&this._onSelectItem(t.eq(this._curItemIndex)))},_onKeyDown:function(e){var t=this._getNavItems();if(e.keyCode===38||e.keyCode===40){e.preventDefault();var n=t.length;if(n){var r=e.keyCode-39,i=this._curItemIndex,s=0;do i+=r;while(i>=0&&i<n&&this._onEnterItem(t.eq(i),!0)===!1&&++s<n)}}},_onKeyUp:function(e){var t=[9,13,16,17,18,27,38,40];~$.inArray(e.keyCode,t)||this._lookup()},_lookup:function(){var e=this._getInput();this._query=e.val(),this._process()},_process:function(){var e=this,t=e._getItems().toArray();t=$.grep(t,function(t){return e._matcher(t)}),e._render(t)},_matcher:function(e){var t=$(e),n=this._query,r=n.toLowerCase(),i=e.text.toLowerCase();return~i.indexOf(r)&&!t.hasClass("organization__create-space")},_render:function(e){var t=this,n=t._getItems(),r=n.not(e),i=t._getSpaceSwitcher(),s=t._getOrganizations();n.each(function(e,n){var r=$(n);t.delMod(r,"hidden").delMod(r,"state").delMod(r,"matched")}),r.each(function(e,n){var r=$(n);!r.hasClass("organization__name")&&!r.hasClass("organization__create-space")&&t.setMod(r,"hidden","yes")}),e.forEach(function(e){var n=$(e);this._query!==""&&t.setMod(n,"matched","yes")}),s.forEach(function(e){var n=e.findElem("name"),r=e.findBlockInside("list"),i=r.findElem("item"),s=i.length,o=0;i.each(function(e,n){var r=$(n);t.hasMod(r,"hidden","yes")&&o++}),s===o+2?t.hasMod(n,"matched","yes")||e.setMod("hidden","yes"):e.delMod("hidden")}),t._updateNavItems(),t._onEnterItem(t._getNavItems().eq(0)),i.setPopupHeight(),t._scrollToCurrent()},_highlight:function(e){var t=this._query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},_onSelectItem:function(e){window.location.href=e.attr("href")},_scrollToCurrent:function(){if(this._curItemIndex<0)return;var e=this.findElem("item","state","selected").get(0).offsetTop,t=this.findElem("spaces"),n=t.scrollTop(),r=e-n,i=this._rowHeight*2,s;r>t.height()-i?s=e-i:n&&r<i&&(s=e-t.height()+i),s&&t.scrollTop(s)},_getData:function(){return this._data},focus:function(){return this.setMod("focused","yes")},blur:function(){return this.delMod("focused")},loadData:function(){var e=this,t=$.Deferred();return e._data?t.resolve():$.ajax({url:"data.json",dataType:"json",success:function(n){e._data=n,t.resolve()},error:function(){t.reject()}}),t.promise()}}),BEM.DOM.decl("organization",{},{_build:function(e){return e.map(function(e,t){var n=e.spaces||[],r=e.image&&e.image.thumbnail_link||"",i=e.name||"",s=e.url||"";return{block:"organization",content:[{elem:"icon",src:r},{block:"list",js:!0,content:[{elem:"item",mix:[{block:"organization",elem:"name"},{block:"space-switcher-filter",elem:"item",elemMods:t===0?{state:"selected"}:{}}],url:s,content:i},n.map(function(e){var t=e.name||"",n=e.url||"";return{elem:"item",mix:[{block:"space-switcher-filter",elem:"item"}],url:n,content:t}}),{elem:"item",mix:[{block:"organization",elem:"create-space"},{block:"space-switcher-filter",elem:"item"}],url:"#create",content:"+ New space"}]}]}})}})