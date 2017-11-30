export const serverUrl = 'https://filipp-zhuravlev.ru';

const getUrl = secondPart => serverUrl + secondPart;

export const loginUrl = getUrl('/account/log_in/');
export const logOutUrl = getUrl('/account/log_out/');
export const registerUrl = getUrl('/account/register/');
export const changePasswordUrl = getUrl('/account/change_password/');
export const changeEmailUrl = getUrl('/account/change_email/');
export const recoverPasswordUrl = getUrl('/account/recover_password/');
export const changeUserAvatarUrl = getUrl('/account/change_user_avatar/');
export const subscribeUrl = getUrl('/account/subscribe/');
export const addWordUrl = getUrl('/words/add_word/');
export const removeWordUrl = getUrl('/words/remove_word/');
export const setUserStateUrl = getUrl('/words/set_user_state/');
export const thankYouServerUrl = getUrl('/words/thank_you_server/');
export const userDataForPluginUrl = getUrl('/words/api/plugin_user/');