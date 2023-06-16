/*! SmallWorlds JavaScript API - v0.1.0 - 2013-11-21 */

(function($) {

    // Collection method.
    $.fn.awesome = function() {
        return this.each(function() {
            $(this).html('awesome');
        });
    };

    // Static method.
    $.awesome = function() {
        return 'awesome';
    };

    // Custom selector.
    $.expr[':'].awesome = function(elem) {
        return elem.textContent.indexOf('awesome') >= 0;
    };

    // Create SW API Access Object and attache it to jQuery namespace.
    let sw = {};
    sw._errorsHandlers = [];
    $.sw = sw;

    let sso = {};
    sso._errorsHandlers = [];
    $.sso = sso;
    // Core functions.
    // ------------------------------------------------------------


    // Initialization function.
    sw.init = function(config) {
        sw.url = config.url;
        sw.surl = config.surl;
    };

    /**
     * Perform an asynchronous HTTP (Ajax) request to the SmallWorlds API.
     * Rather than passing in callback functions via the ajax settings, a deffered
     * implementation is provided where multiple callback functions can be attached
     * via the returned responder object.
     *
     * @param settings The jQuery.ajax() settings to use.
     * @return A request object which can be used to attach callback functions.
     * The responder includes has the followng methods:
     * .success(function), .error(function), .complete(function), abort()
     *
     */
    sw.ajax = function(settings) {

        // Callback context
        let callbackContext = this;

        // Deferred.
        let deferred = $.Deferred();

        // Create error handler.
        let errorHandler = {error: function(data) {

                // Error handling.
                deferred.rejectWith(callbackContext, [data]);
            }};


        // Call JQuery getJSON.
        let jqXHR = $.ajax(settings);

        // Create responder.
        let responder = {

            jqXHR: jqXHR,

            // Cancel the request
            abort: function() {
                jqXHR.abort('Cancel');
                return this;
            }
        };

        // Attach deferreds.
        deferred.promise(responder);
        responder.success = responder.done;
        responder.error = responder.fail;
        responder.complete = responder.always;

        // Register global error handlers.
        for (let i = 0; i < sw._errorsHandlers.length; i++) {
            responder.error(sw._errorsHandlers[i]);
        }

        // Use JQuery Ajax request object.
        jqXHR

            // Add ajax success callback. Optional arguments textStatus, jqXHR ignored.
            .success(function(data) {

                // Check for error.
                if (data != null && data.hasOwnProperty('success') && !data.success) {

                    // Error handling.
                    errorHandler.error(data);
                    return;
                }

                // Success.
                deferred.resolveWith(callbackContext, [data]);
            })

            // Add ajax error callback.
            .error(function(data, textStatus, jqXHR) {
                errorHandler.error({success:false, errorCode:1, data: data,
                    textStatus: textStatus, jqXHR: jqXHR
                });
            });

        // Return responder to calling code.
        return responder;
    };

    sso.ajax = function(settings) {

        // Callback context
        let callbackContext = this;

        // Deferred.
        let deferred = $.Deferred();

        // Create error handler.
        let errorHandler = {error: function(data) {

                // Error handling.
                deferred.rejectWith(callbackContext, [data]);
            }};


        // Call JQuery getJSON.
        let jqXHR = $.ajax(settings);

        // Create responder.
        let responder = {

            jqXHR: jqXHR,

            // Cancel the request
            abort: function() {
                jqXHR.abort('Cancel');
                return this;
            }
        };

        // Attach deferreds.
        deferred.promise(responder);
        responder.success = responder.done;
        responder.error = responder.fail;
        responder.complete = responder.always;

        // Register global error handlers.
        // for (let i = 0; i < sw._errorsHandlers.length; i++) {
        //     responder.error(sw._errorsHandlers[i]);
        // }

        // Use JQuery Ajax request object.
        jqXHR

            // Add ajax success callback. Optional arguments textStatus, jqXHR ignored.
            .success(function(data) {

                // Check for error.
                if (data != null && data.hasOwnProperty('success') && !data.success) {

                    // Error handling.
                    errorHandler.error(data);
                    return;
                }

                // Success.
                deferred.resolveWith(callbackContext, [data]);
            })

            // Add ajax error callback.
            .error(function(data, textStatus, jqXHR) {
                errorHandler.error({success:false, errorCode:1, data: data,
                    textStatus: textStatus, jqXHR: jqXHR
                });
            });

        // Return responder to calling code.
        return responder;
    };

    /**
     * GET REST API call.
     */
    sw.get = function(path, secure) {

        if (secure === undefined) { secure = false; }

        // Create fully pathed url.
        let url = sw.url + path;
        let swsid = Cookies.get("SWID");

        // Create ajax settings.
        let settings = {
            url: url,
            headers: { 'Authorization': 'Bearer '+ swsid,
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            dataType: 'json'
        };

        if(secure === true) {
            settings.url = sw.surl + path;
        }

        // Peform get json.
        return sw.ajax(settings);
    };

    /**
     * POST REST API call.
     */
    sw.post = function(path, json, secure) {

        if (secure === undefined) { secure = false; }

        // Create fully pathed url.
        let url = sw.url + path;
        let swsid = Cookies.get("SWID");
        // Create ajax settings.
        let settings = {
            url: url,
            type: 'post',
            headers: { 'Authorization': 'Bearer '+ swsid,
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            contentType: 'application/json'
        };

        if(secure === true) {
            settings.url = sw.surl + path;
        }

        // Include json data.
        if (json != null) {
            settings.data = JSON.stringify(json);
            settings.dataType = 'json';
        }

        // Peform get json.
        return sw.ajax(settings);
    };

    /**
     * Register a handler to be called when any API requests complete with an error.
     */
    sw.error = function(callback) {
        sw._errorsHandlers.push(callback);
    };

    // Error Codes.
    // ------------------------------------------------------------

    sw.errorCode = {};

    sw.errorCode.INTERNAL_ERROR = 1;
    sw.errorCode.SESSION_EXPIRED = 2;
    sw.errorCode.DO_NOT_HAVE_PERMISSION = 5;
    sw.errorCode.INVALID_PARAM = 100;
    sw.errorCode.REGISTER_EMAIL_ALREADY_TAKEN = 200;
    sw.errorCode.LOGIN_EMAIL_NOT_FOUND = 301;
    sw.errorCode.LOGIN_ACCOUNT_NOT_ACTIVE = 302;
    sw.errorCode.LOGIN_INVALID_PASSWORD = 303;
    sw.errorCode.LOGIN_ACCOUNT_BANNED = 305;
    sw.errorCode.AVATAR_NOT_FOUND = 600;
    sw.errorCode.USER_NOT_FOUND = 1011;

    // Auth.
    // ------------------------------------------------------------

    sw.auth = {};

    /**
     * Login the current user. Must provide username and password in JSON format.
     */
    sw.auth.login = function(login) {

        // Post login data.
        return sw.post('auth/login', login, true);
    };

    /**
     * Login the current user using their facebook account details.
     */
    sw.auth.facebookLogin = function(login) {

        // Post login data.
        return sw.post('auth/facebooklogin', login, true);
    };

    /**
     * Sends an email to the user to enable them to retrieve their forgotten password.
     */
    sw.auth.forgotPassword = function(email) {

        // Post email data.
        return sw.post('auth/forgotpassword', email, true);
    };

    /**
     * Login the current user using their facebook account details.
     */
    sw.auth.logout = function() {

        // Post login data.
        return sw.post('auth/logout');
    };


    sso.post = function(path, id) {
    
        // Create fully pathed url.
        let url = path;
        // Create ajax settings.
        let settings = {
            url: path,
            type: 'post',
            // headers: { 'Authorization': 'Bearer '+ JSON.stringify(id)+';Access-Control-Allow-Origin: *; Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS;' },
            crossDomain: true,
            withCredentials: true,
            contentType: 'application/json'
        };

        // if(secure === true) {
        //     settings.url = sw.surl + path;
        // }

        // Include json data.
        if (id != null) {
            settings.data = JSON.stringify(id);
            settings.dataType = 'json';
        }

        // Peform get json.
        return sso.ajax(settings);
    };
    // User.
    // ------------------------------------------------------------
    sso.try = {};

    sso.try.call = function(path, id)
    {
        return sso.post(path +'access/'+id+'', id);

        // return sso.post(path, id);
    }
    // Create user core rest service.
    sw.user = {};

    /**
     * Get the current user's information.
     */
    sw.user.me = function(secure) {
        if (secure === undefined) { secure = false; }
        // Get me.
        return sw.get('me', secure);
    };

    sw.user.sesh = function(secure) {
        if (secure === undefined) { secure = false; }
        // Get me.
        return sw.get('session', secure);
    };
    sw.user.sso = function(token) {
        if (token === undefined) { token = false; }
        // Get me.
        return sso.post('access/'+token+'', token);
    };

    /**
     * Check that the specified email is available for joining a new account.
     * Error code 200 if the email is taken by another user.
     */
    sw.user.checkEmailAvailable = function(email) {

        // Get check email available.
        return sw.get('user/emailavailable/'+email, true);
    };

    /**
     * Get the current user's logged in status (true for logged in, otherwise false).
     */
    sw.user.loggedIn = function() {

        // Get logged in.
        return sw.get('user/loggedin');
    };

    /**
     * Sign up / Register a new user. Must supply a user email and password.
     * Alternatively use signUpSkip() for Facebook and
     * other social networks.
     */
    sw.user.join = function(joinData) {

        // Post join data.
        return sw.post('user/make/join', joinData, true);
    };
    sw.user.ip = function(ipData) {

        // Post join data.
        return sw.post('user/serverip', ipData, true);
    };

    sw.user.cp = function(cpData) {

        // Post join data.
        return sw.post('user/contentpath', cpData, true);
    };

    sw.user.worldOnline = function() {
        return sw.get('world/online');
    };



    /**
     * Sign up / Register a new user using their facebook account.
     */
    sw.user.facebookjoin = function(facebookJoinData) {

        // Post join data.
        return sw.post('user/facebookjoin', facebookJoinData, true);
    };


    // Avatar.
    // ------------------------------------------------------------

    sw.avatar = {};

    /**
     * Get the user's current avatar.
     */
    sw.avatar.getSelected = function() {

        // Get selected avatar.
        return sw.get('avatar/selected');
    };

    /**
     * Get avatar by id.
     */
    sw.avatar.getAvatarById = function(avatarId) {

        // Get avatar by id.
        return sw.get('avatar/' + avatarId);
    };

    /**
     * Get avatar by name.
     */
    sw.avatar.getAvatarByName = function(avatarName) {

        // Get avatar by name.
        return sw.get('avatar/name/' + avatarName);
    };

    /**
     * Check available avatar name.
     */
    sw.avatar.checkAvailableName = function(avatar) {

        // Check available avatar name.
        return sw.post('avatar/nameavailable', avatar, (window.location.protocol === 'https:'));
    };

    /**
     * Check available avatar name.
     */
    sw.avatar.findTotalOnline = function() {

        // Check available avatar name.
        return sw.get('avatar/findtotalonline');
    };

    /**
     * Update Default Avatar
     */
    sw.avatar.makeDefaultAvatar = function(avatarId) {

        // Update Default Avatar
        return sw.get('avatar/makeDefaultAvatar/' + avatarId);
    };

    /**
     * Update Avatar's Motto
     */
    sw.avatar.updateAvatarMotto = function(avatar) {

        // Update Default Avatar
        return sw.post('avatar/updateAvatarMotto', avatar);
    };

    /**
     * Choose Avatar
     */
    sw.avatar.chooseAvatar = function(avatarId) {

        // Update Default Avatar
        return sw.get('avatar/chooseAvatar/' + avatarId);
    };

    /**
     * Update Avatar's TakePet
     */
    sw.avatar.updateTakePet = function(avatar) {

        // Update Avatar's TakePet
        return sw.post('avatar/updateTakePet', avatar);
    };

    sw.avatar.updateHeaderSetting = function(avatar) {
        return sw.post('avatar/header', avatar);
    };

    /**
     * Create Avatar
     */
    sw.avatar.createAvatar = function(avatar) {

        // Create Avatar
        return sw.post('avatar/createAvatar', avatar);
    };

    /**
     * Delete Avatar
     */
    sw.avatar.deleteAvatar = function(avatarId) {

        // Delete Avatar
        return sw.post('avatar/deleteAvatar/' + avatarId);
    };


    // Space
    // ------------------------------------------------------------

    sw.space = {};

    /**
     * Retrieve current inworld time.
     */
    sw.space.getSpaceTime = function() {
        return sw.get('space/time');
    };

    /**
     * Retrieve space name
     * @param spaceId
     */
    sw.space.getSpaceName = function(spaceId) {
        return sw.get('space/name' + spaceId);
    };




    // Space - Event
    // ------------------------------------------------------------

    sw.space.event = {};

    /**
     * Retrieve a random list of the latest space events.
     */
    sw.space.event.getLatestEvents = function() {

        // Get latest space events.
        return sw.get('space/event/latest');
    };

    // Space - Fav
    // ------------------------------------------------------------

    sw.space.fav = {};

    /**
     * Retrieve space favourites for the current avatar.
     */
    sw.space.fav.getMyFavorites = function() {

        // Get fav spaces.
        return sw.get('space/fav/mine');
    };

    // Promotion.
    // ------------------------------------------------------------

    sw.promotion = {};

    // Promotion - Panel.
    // ------------------------------------------------------------

    sw.promotion.panel = {};

    sw.promotion.panel.getPanelsForTag = function(tag) {

        // Get panels for tag.
        return sw.get('promotion/panel/tag/' + tag);
    };

    // Kontagent.
    // ------------------------------------------------------------

    sw.kontagent = {};

    /**
     * Queue a custom event against the session, to be sent to Kontagent either
     * when the session has an associated user ID, or after a timeout.
     */
    sw.kontagent.queueCustomEvent = function(event) {

        // Post event.
        return sw.post('kontagent/queuecustomevent', event, (window.location.protocol === 'https:'));
    };

    // Pet.
    // ------------------------------------------------------------

    sw.pet = {};

    sw.pet.getPetByAvatarId = function(avatarId) {

        // Get pet status
        return sw.get('pet/' + avatarId);
    };

    // Spin To Win.
    // ------------------------------------------------------------

    sw.spintowin = {};

    sw.spintowin.check = function() {

        // Get Spin to Win status
        return sw.get('spintowin/check');
    };

    // Balance 
    // ------------------------------------------------------------
    sw.balance = {};

    sw.balance.getBalance = function() {

        // Get balance
        return sw.get('balance');
    };

    // Planter.
    // ------------------------------------------------------------

    sw.plant = {};

    sw.plant.check = function() {

        // Get plant status
        return sw.get('plant/check');
    };

    // Communication - Filter.
    // ------------------------------------------------------------

    sw.filter = {};

    sw.filter.validate = function(value, secure) {

        // Run validation.
        return sw.post('filter/validate', value, secure);
    };

}(jQuery));


