export const ROUTES = {
  AUTH: {
    CONTROLLER: 'auth',
    REGISTER_USER: 'register-user',
    LOG_USER_IN: 'login-user',
    LOG_OUT: 'logout',
    REGISTER_SUPER_ADMIN: 'register-super-admin',
    REGISTER_INSTITUTE_MANAGERS: 'register-institute-manager',
    REGISTER_INSTITUTE_STUDENT: 'register-student/:instituteID',
    REGISTER_INSTITUTE_TEACHER: 'register-teacher/:instituteID',
  },

  USERS: {
    CONTROLLER: 'users',
    UPDATE_PROFILE: 'profile',
  },

  INSTITUTES: {
    CONTROLLER: 'institutes',
    CREATE: '',
    FIND_ALL: '',
    FIND_ONE: ':institutesID',
    UPDATE_ONE: ':institutesID',
    DELETE_ONE: ':institutesID',
    ADD_INSTITUTE_MANAGER: ':institutesID/:managerID',
  },

  DIVISIONS: {
    CONTROLLER: 'divisions',
    CREATE: ':institutesID',
    FIND_ALL: '',
    FIND_ONE: ':institutesID/:divisionsID',
    UPDATE_ONE: ':institutesID/:divisionsID',
    DELETE_ONE: ':institutesID/:divisionsID',
    ADD_STUDENT: 'add-student/:divisionsID/:studentID',
    ADD_TEACHER: 'add-teacher/:divisionsID/:teacherID',
  },
  WIRDS: {
    CONTROLLER: 'wirds',
    CREATE: ':studentID/:divisionsID',
    FIND_ALL: '',
    FIND_ONE: ':institutesID/:divisionsID',
    UPDATE_ONE: ':institutesID/:divisionsID',
    DELETE_ONE: ':institutesID/:divisionsID',
    ADD_STUDENT: ':institutesID/:divisionsID/:studentID',
  },
};
