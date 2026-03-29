INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
VALUES ('Admin', 'admin@nhal.dz', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
SELECT id, nom, email, role FROM utilisateurs;
UPDATE utilisateurs 
SET mot_de_passe = '$2b$10$O/euzn1fhijJNRIrmmrwJuluDxvl6lpZFig01HJ0BvS7g3TsR.Ouu'
WHERE email = 'admin@nhal.dz';
