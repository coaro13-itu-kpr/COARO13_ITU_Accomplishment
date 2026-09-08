-- Migration: Update accomplishment categories to new structure
-- Date: 2026-09-08

-- Handle category renames first
UPDATE accomplishments SET category = 'Submission of AARs for Publication'
WHERE category = 'Submission of Annual Audit Reports for Publication';

UPDATE accomplishments SET category = 'Submission of CARs for Publication'
WHERE category = 'Submission of Compliance Audit Reports for Publication';

UPDATE accomplishments SET category = 'CAMS and Biometric Machine Maintenance and System Administration'
WHERE category = 'Biometric Machine Maintenance and System Administration';

UPDATE accomplishments SET category = 'Initial Setup of New Desktop/Laptop'
WHERE category = 'Troubleshooting - Initial Setup of New Desktop/Laptop';

UPDATE accomplishments SET category = 'Assistance in Defining IT Specifications'
WHERE category = 'Assistance in defining IT specifications';

UPDATE accomplishments SET category = 'Voice over Internet Protocol (VoIP)-PBX Installation/Configuration, Administration and Maintenance'
WHERE category = 'Voice over Internet Protocol (VoIP) installation/configuration, administration and maintenance';

UPDATE accomplishments SET category = 'Walk-in Client Queries'
WHERE category = 'Walk-in client queries';

-- Handle category moves and consolidations
UPDATE accomplishments SET category = 'CAMS and Biometric Machine Maintenance and System Administration'
WHERE category = 'Troubleshooting - Daily Time Record Updating';

UPDATE accomplishments SET category = 'Others'
WHERE category = 'Setup Audio/Visual/Zoom Meetings';

-- Consolidate eNGAS and eBudget entries
UPDATE accomplishments SET category = 'Technical Support for eNGAS and eBudget System'
WHERE category IN ('eNGAS and eBudget Support', 'eNGAS and eBudget Roll-out');

-- Remove obsolete troubleshooting subcategories that were consolidated
UPDATE accomplishments SET category = 'Others'
WHERE category IN ('Troubleshooting - CAMS Problems', 'Troubleshooting - VoIP Problems', 'Troubleshooting - Internet Connectivity Problems');

-- Verify migration (optional - comment out after verification)
-- SELECT category, COUNT(*) FROM accomplishments GROUP BY category ORDER BY category;
