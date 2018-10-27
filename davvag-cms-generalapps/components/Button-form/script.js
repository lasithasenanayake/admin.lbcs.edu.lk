WEBDOCK.component().register(function(exports){
    var scope;
    var handler;
    var pInstance, validatorInstance;
    var routeData;
    
    var bindData = {
        product:{},
        uoms:[],
        content:""

    };

    var vueData =   {
        methods: {
            submit: submit,
            gotoUom: gotoUom,
            navigateBack: function(){
                handler1 = exports.getShellComponent("soss-routes");
                handler1.appNavigate("..");
            }
        },
        data : bindData,
        onReady : function(s){
            scope = s;
            handler = exports.getComponent("cms-gapp-handler");
            pInstance = exports.getShellComponent("soss-routes");
            validatorInstance = exports.getShellComponent ("soss-validator");
            routeData = pInstance.getInputData();
            loadValidator();
            if (routeData)
                loadCategory(scope);
            //$('#editor').wysiwyg();
        }
    }

    function loadCategory(scope){
        if (routeData.id)
        handler.transformers.getButtonbyid(routeData.id)
        .then(function(result){
            if (result.result.length !=0){
                bindData.product = result.result[0];
            }
        })
        .error(function(){
    
        });
    }

    var validator;
    function loadValidator(){
        validator = validatorInstance.newValidator (scope);
        validator.map ("product.Name",true, "You should enter a name");
        validator.map ("product.url",true, "You should enter a url");
    }

    function submit(){
        $('#send').prop('disabled', true);
        scope.submitErrors = validator.validate(); 
        if (!scope.submitErrors){

            var promiseObj;
            if (routeData.id) promiseObj = handler.transformers.updateButton (bindData.product);
            else promiseObj = handler.transformers.insertButton (bindData.product);

            promiseObj
            .then(function(){
                gotoUom();
            })
            .error(function(){
                $('#send').prop('disabled', false);
            });
        }else{
            $('#send').prop('disabled', false);
        }
    }

    function gotoUom(){
        handler1 = exports.getShellComponent("soss-routes");
        handler1.appNavigate("..");
    }


    exports.vue = vueData;
    exports.onReady = function(element){
        
    }
});
