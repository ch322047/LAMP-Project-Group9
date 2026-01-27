USE COP4331;

-- -------------------------
-- Users seed data
-- -------------------------
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES
('Santiago','Aguilar','santi','hash_pw_santi'),
('Diego','Martinez','dmartinez','hash_pw_dmartinez'),
('Camila','Rojas','crojas','hash_pw_crojas'),
('Andres','Lopez','alopez','hash_pw_alopez'),
('Valeria','Gomez','vgomez','hash_pw_vgomez'),
('Mateo','Perez','mperez','hash_pw_mperez'),
('Sofia','Hernandez','shernandez','hash_pw_shernandez'),
('Lucas','Rivera','lrivera','hash_pw_lrivera'),
('Isabella','Torres','itorres','hash_pw_itorres'),
('Nicolas','Diaz','ndiaz','hash_pw_ndiaz'),
('Daniela','Castro','dcastro','hash_pw_dcastro');

-- -------------------------
-- Contacts seed data
-- -------------------------
INSERT INTO Contacts (OwnerId, FirstName, LastName, Phone, Email) VALUES
(1,'Chris','Miller','+1-407-555-0101','chris.miller@example.com'),
(1,'Ana','Santos','+1-407-555-0102','ana.santos@example.com'),
(1,'Miguel','Suarez','+1-407-555-0103','miguel.suarez@example.com'),

(2,'Ava','Wilson','+1-305-555-0301','ava.wilson@example.com'),
(2,'Liam','Taylor','+1-305-555-0302','liam.taylor@example.com'),
(2,'Mia','Anderson','+1-305-555-0303','mia.anderson@example.com'),

(3,'Ethan','Thomas','+1-786-555-0401','ethan.thomas@example.com'),
(3,'Amelia','Moore','+1-786-555-0402','amelia.moore@example.com'),
(3,'James','Jackson','+1-786-555-0403','james.jackson@example.com'),

(4,'Charlotte','Martin','+1-954-555-0501','charlotte.martin@example.com'),
(4,'Benjamin','Lee','+1-954-555-0502','benjamin.lee@example.com'),
(4,'Harper','Thompson','+1-954-555-0503','harper.thompson@example.com'),

(5,'Elijah','White','+1-813-555-0601','elijah.white@example.com'),
(5,'Evelyn','Harris','+1-813-555-0602','evelyn.harris@example.com'),
(5,'Henry','Clark','+1-813-555-0603','henry.clark@example.com'),

(6,'Abigail','Lewis','+1-352-555-0701','abigail.lewis@example.com'),
(6,'Sebastian','Robinson','+1-352-555-0702','sebastian.robinson@example.com'),
(6,'Emily','Walker','+1-352-555-0703','emily.walker@example.com'),

(7,'Jack','Young','+1-561-555-0801','jack.young@example.com'),
(7,'Scarlett','Allen','+1-561-555-0802','scarlett.allen@example.com'),
(7,'Owen','King','+1-561-555-0803','owen.king@example.com'),

(8,'Grace','Wright','+1-904-555-0901','grace.wright@example.com'),
(8,'Leo','Scott','+1-904-555-0902','leo.scott@example.com'),
(8,'Chloe','Green','+1-904-555-0903','chloe.green@example.com'),

(9,'David','Baker','+1-239-555-1001','david.baker@example.com'),
(9,'Lily','Adams','+1-239-555-1002','lily.adams@example.com'),
(9,'Julian','Nelson','+1-239-555-1003','julian.nelson@example.com'),

(10,'Zoe','Carter','+1-772-555-1101','zoe.carter@example.com'),
(10,'Aiden','Mitchell','+1-772-555-1102','aiden.mitchell@example.com'),
(10,'Hannah','Perez','+1-772-555-1103','hannah.perez@example.com'),

(11,'Isaac','Roberts','+1-941-555-1201','isaac.roberts@example.com'),
(11,'Nora','Turner','+1-941-555-1202','nandora.turner@example.com'),
(11,'Wyatt','Phillips','+1-941-555-1203','wyatt.phillips@example.com');

-- Checks
SELECT COUNT(*) AS user_count FROM Users;
SELECT COUNT(*) AS contact_count FROM Contacts;
SELECT OwnerId, COUNT(*) AS contacts_per_user FROM Contacts GROUP BY OwnerId ORDER BY OwnerId;

