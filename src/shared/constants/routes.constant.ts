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

  STUDENTS: {
    CONTROLLER: 'students',
    FIND_ALL: '',
    FIND_ONE: ':studentID',
    UPDATE_ONE: 'update-student',
    SUSPEND_ONE: 'suspend-unsuspend/:studentID',
  },
  TEACHERS: {
    CONTROLLER: 'teachers',
    FIND_ALL: '',
    FIND_ONE: ':teacherID',
    UPDATE_ONE: 'update-teacher',
    SUSPEND_ONE: 'suspend-unsuspend/:teacherID',
  },
  INSTITUTES: {
    CONTROLLER: 'institutes',
    CREATE: '',
    FIND_ALL: '',
    FIND_ONE: ':institutesID',
    UPDATE_ONE: ':institutesID',
    DELETE_ONE: 'delete/:institutesID',
    UN_DELETE_ONE: 'undelete/:institutesID',
    ADD_INSTITUTE_MANAGER: ':institutesID/:managerID',
  },

  DIVISIONS: {
    CONTROLLER: 'divisions',
    CREATE: ':institutesID',
    FIND_ALL: '',
    FIND_INSTITUTE_DIVISION: ':instituteID',
    FIND_ONE: ':institutesID/:divisionsID',
    UPDATE_ONE: ':divisionID',
    DELETE_ONE: 'delete-undelete/:divisionID',
    ADD_STUDENT: 'add-student/:divisionsID/:studentID',
    ADD_TEACHER: 'add-teacher/:divisionsID/:teacherID',
  },
  WIRDS: {
    CONTROLLER: 'wirds',
    CREATE: ':studentID/:divisionsID',
    FIND_ALL_STUDENT_WRIDS: 'student/:divisionID/:studentID',
    FIND_ALL_TESCHER_WRIDS: 'teacher/:divisionID/:teacherID',
    FIND_ONE: ':wirdID',
    UPDATE_ONE: ':wirdID',
    DELETE_ONE: ':wirdID',
    ADD_STUDENT: ':institutesID/:divisionsID/:studentID',
  },
};
