-- Populate supported_snps table with essential genetic variants for proper SNP enrichment
-- This fixes the "Unknown" gene issue in AI chat

INSERT INTO supported_snps (rsid, gene) VALUES
-- MTHFR variants (methylation pathway)
('rs1801133', 'MTHFR'),
('rs1801131', 'MTHFR'),

-- COMT variants (neurotransmitter metabolism)
('rs4680', 'COMT'),
('rs4633', 'COMT'),
('rs4818', 'COMT'),
('rs769224', 'COMT'),

-- VDR variants (vitamin D receptor)
('rs1544410', 'VDR'),
('rs2228570', 'VDR'),
('rs731236', 'VDR'),

-- APOE variants (Alzheimer's risk, lipid metabolism)
('rs429358', 'APOE'),
('rs7412', 'APOE'),

-- CBS variants (sulfur metabolism)
('rs1801181', 'CBS'),
('rs234706', 'CBS'),
('rs28934891', 'CBS'),
('rs4920037', 'CBS'),
('rs2851391', 'CBS'),

-- MTR/MTRR variants (B12 metabolism)
('rs1805087', 'MTR'),
('rs1801394', 'MTRR'),
('rs1532268', 'MTRR'),

-- FADS variants (fatty acid metabolism)
('rs174548', 'FADS1'),
('rs174537', 'FADS1'),
('rs1535', 'FADS2'),

-- GST variants (detoxification)
('rs1695', 'GSTP1'),
('rs1138272', 'GSTP1'),

-- HFE variants (iron metabolism)
('rs1799945', 'HFE'),
('rs1800562', 'HFE'),
('rs1800730', 'HFE'),

-- TCN2 variants (B12 transport)
('rs1801198', 'TCN2'),

-- DHFR variants (folate metabolism)
('rs1643649', 'DHFR'),

-- SOD variants (antioxidant enzymes)
('rs4880', 'SOD2'),
('rs2070424', 'SOD1'),
('rs4998557', 'SOD1'),
('rs2758331', 'SOD2'),
('rs1799895', 'SOD3'),

-- NOS3 variants (nitric oxide synthesis)
('rs1799983', 'NOS3'),
('rs2070744', 'NOS3'),

-- PEMT variants (choline metabolism)
('rs4244593', 'PEMT'),
('rs4646406', 'PEMT'),
('rs7946', 'PEMT'),

-- BCMO1 variants (beta-carotene conversion)
('rs11645428', 'BCMO1'),
('rs12934922', 'BCMO1'),
('rs6564851', 'BCMO1'),
('rs7501331', 'BCMO1'),
('rs6420424', 'BCMO1'),

-- FUT2 variants (gut microbiome, B12 absorption)
('rs602662', 'FUT2'),
('rs492602', 'FUT2'),
('rs601338', 'FUT2'),

-- ADORA2A variants (caffeine sensitivity)
('rs5751876', 'ADORA2A'),

-- CYP variants (drug metabolism)
('rs1056836', 'CYP1B1'),
('rs6413432', 'CYP2E1'),
('rs1048943', 'CYP1A1'),

-- MAOA/MAOB variants (neurotransmitter breakdown)
('rs1137070', 'MAOA'),
('rs6323', 'MAOA'),
('rs72554632', 'MAOA'),
('rs1799836', 'MAOB'),

-- Additional important variants
('rs1050450', 'GPX1'),
('rs1800566', 'NQO1'),
('rs662', 'PON1'),
('rs1799963', 'F2'),
('rs6025', 'F5'),
('rs1050891', 'HNMT'),
('rs34637584', 'LRRK2'),
('rs72558181', 'MAT1A'),
('rs2287182', 'MMAB'),
('rs6495446', 'MTHFS'),
('rs2236225', 'MTHFD1'),
('rs1141321', 'MUT'),
('rs9369898', 'MUT'),
('rs651933', 'FOLR2'),
('rs1051266', 'SLC19A1'),
('rs1979277', 'SHMT1'),
('rs7297662', 'SUOX'),
('rs773115', 'SUOX'),
('rs526934', 'TCN1'),
('rs1800629', 'TNF'),
('rs3741775', 'DAOA'),
('rs10156191', 'DAO'),
('rs819147', 'AHCY'),
('rs1050828', 'G6PD'),
('rs1050829', 'G6PD'),
('rs5030868', 'G6PD'),

-- Common metabolic variants
('rs7903146', 'TCF7L2'),
('rs1801282', 'PPARG'),
('rs1501299', 'ADIPOQ')

ON CONFLICT (rsid) DO UPDATE SET gene = EXCLUDED.gene; 