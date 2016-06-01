INSERT INTO role (id, name) VALUES (1, 'ROLE_USER');
INSERT INTO role (id, name) VALUES (2, 'ROLE_ADMIN');

INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (1, NOW(), NOW(), 'PI', 'USER', 'pius1234',
   '$2a$08$wyF7Pdf.9Mb3iWwCtofUr.ltjHoWmpzfcFfmXYKfdTDVQf5S41XFW');

INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (1, 1, 1);
INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (2, 1, 2);

INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (2, NOW(), NOW(), 'Markus', 'Klein', 'klma1040',
   '$2a$08$DvZINePo37O1wNS1PD6y2.L1IUI3zOLyk56QQqXa/cvR0rufZ4ulq');

INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (3, 2, 1);
INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (4, 2, 2);

INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (3, NOW(), NOW(), 'Daniel', 'Wörner', 'woda1017',
   '$2a$08$8yizNJeLsq.zW7u0nEXNUOtGGam3qlJ8deC1kvbYjy.IJkGTFF2uy');

INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (4, NOW(), NOW(), 'Peter', 'Grittner', 'grpe1012',
   '$2a$08$nKSvn.NXtf04pIdD5hCj..VWVcwx.2BWZ8msy2b.j56fBdjc/TCRK');

INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (5, 3, 1);
INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (6, 4, 1);