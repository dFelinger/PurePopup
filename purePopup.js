;(function() {
    'use strict';
    
    var Popup = function() {
        // this.el = typeof el === 'object' ? el : document.getElementById(el);

        // For check current popup type
        this.type = 'alert';
        
        // Set default params
        this.params = {};
        this.setParams();
        
        this.wrap = document.createElement('div');
        this.wrap.id = 'purePopupWrap';
        document.body.appendChild(this.wrap);
        this.wrap.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.target == this.wrap) this.close('noActionCancel');

            // TODO: settings: close on click
            if (e.target.className.indexOf('purePopupButton') != -1) this.close(e.target.className.match(/_(.*)_/)[1]);
        }.bind(this));
    }
    
    Popup.prototype.setParams = function (params, callback) {
        this.params.title = document.title;
        this.params.callback = null;
        this.params.buttons = (this.type == 'alert') ? {ok: 'Ok'} : {ok: 'Ok', cancel: 'Cancel'};
        this.params.inputs = {name: 'Please, enter your name'};

        if (params) {
            if (typeof params == 'object') {
                params = params;
                if (callback && typeof callback == 'function') params.callback = callback;
            } else if (typeof params == 'function') {
                params = {callback: params};
            }
        } else params = {};

        for (var p in params) if (this.params.hasOwnProperty(p)) this.params[p] = params[p];
    }

    Popup.prototype.show = function () {
        this.wrap.className = 'open';
        setTimeout(function(){
            this.wrap.className = 'open pop';
        }.bind(this), 20);
    }

    Popup.prototype.close = function (confirm) {
        this.wrap.className = 'open';
        setTimeout(function() {
            this.wrap.className = '';
            var result = {confirm: confirm};
            
            var inputs = this.wrap.getElementsByTagName('input'); 
            for (var i = inputs.length; --i >= 0;) result[inputs[i].name] = inputs[i].value; 
            
            if (this.params.callback) this.params.callback.call(this, result);
        }.bind(this), 300);
    }

    Popup.prototype.alert = function (p, c) {
        this.type = 'alert';
        this.setParams(p, c);
        
        var buttonsHtml = '';
        for (var i in this.params.buttons) buttonsHtml += '<span class="purePopupButton _'+i+'_">'+this.params.buttons[i]+'</span>';

        this.wrap.innerHTML = '<div>'+
                                '<div>'+
                                    '<div class="purePopupTitle">'+this.params.title+'</div>'+
                                    buttonsHtml+
                                '</div>'+
                               '</div>';
        this.show();
    }
    
    Popup.prototype.confirm = function (p, c) {
        this.type = 'confirm';
        this.setParams(p, c);
        
        var buttonsHtml = '';
        for (var i in this.params.buttons) buttonsHtml += '<span class="purePopupButton _'+i+'_">'+this.params.buttons[i]+'</span>';

        this.wrap.innerHTML = '<div>'+
                                '<div>'+
                                    '<div class="purePopupTitle">'+this.params.title+'</div>'+
                                    buttonsHtml+
                                '</div>'+
                               '</div>';
        this.show();
    }
    
    Popup.prototype.prompt = function (p, c) {
        this.type = 'prompt';
        this.setParams(p, c);
        
        var inputsHtml = '', tabIndex = 0;
        for (var i in this.params.inputs) inputsHtml += '<label for="purePopupInputs_'+i+'">'+this.params.inputs[i]+'</label><input id="purePopupInputs_'+i+'" name="'+i+'" type="text" tabindex="'+(tabIndex++)+'">';
        
        var buttonsHtml = '';
        for (var i in this.params.buttons) buttonsHtml += '<span class="purePopupButton _'+i+'_">'+this.params.buttons[i]+'</span>';

        this.wrap.innerHTML = '<div>'+
                                '<div>'+
                                    '<div class="purePopupTitle">'+this.params.title+'</div>'+
                                    inputsHtml+
                                    buttonsHtml+
                                '</div>'+
                               '</div>';
        this.show();
    }
    
    window.PurePopup = new Popup();
}());