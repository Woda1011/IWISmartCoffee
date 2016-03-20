INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (1, NOW(), NOW(), 'Markus', 'Klein', 'klma1040',
   '$2a$08$DvZINePo37O1wNS1PD6y2.L1IUI3zOLyk56QQqXa/cvR0rufZ4ulq');

INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (1, 1, 1);
INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (2, 1, 2);
