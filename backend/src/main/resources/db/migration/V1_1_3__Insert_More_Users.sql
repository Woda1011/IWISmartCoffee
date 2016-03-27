INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (2, NOW(), NOW(), 'Daniel', 'Wörner', 'woda1017',
   '$2a$08$8yizNJeLsq.zW7u0nEXNUOtGGam3qlJ8deC1kvbYjy.IJkGTFF2uy');

INSERT INTO student (id, created_at, updated_at, first_name, last_name, hska_id, password) VALUES
  (3, NOW(), NOW(), 'Peter', 'Grittner', 'grpe1012',
   '$2a$08$nKSvn.NXtf04pIdD5hCj..VWVcwx.2BWZ8msy2b.j56fBdjc/TCRK');

INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (3, 2, 1);
INSERT INTO student_role_assignment (id, student_id, role_id) VALUES (4, 3, 1);
