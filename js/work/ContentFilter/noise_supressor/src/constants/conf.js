export const serverUrl = 'https://filipp-zhuravlev.ru';

const getUrl = secondPart => serverUrl + secondPart;

export const loginUrl = getUrl('/account/log_in/');
export const registerUrl = getUrl('/account/register/');
export const changePasswordUrl = getUrl('/account/change_password/');
export const changeEmailUrl = getUrl('/account/change_email/');
export const recoverPasswordUrl = getUrl('/account/recover_password/');
export const changeUserAvatarUrl = getUrl('/account/change_user_avatar/');
export const subscribeUrl = getUrl('/account/subscribe/');
