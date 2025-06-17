import { useState, useEffect } from 'react';
import { getBiomarkerEducation, getSNPEducation } from '@/lib/analysis-helpers';

interface EducationData {
  [key: string]: any;
}

export const useEducationData = (
  biomarkers: any[],
  snps: any[],
  userConditions: any[] = [],
  userAllergies: any[] = []
) => {
  const [biomarkerEducation, setBiomarkerEducation] = useState<EducationData>({});
  const [snpEducation, setSnpEducation] = useState<EducationData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEducationData = async () => {
      if (biomarkers.length === 0 && snps.length === 0) return;
      
      setLoading(true);
      
      try {
        // Load biomarker education data
        const biomarkerPromises = biomarkers.map(async (marker, index) => {
          // Ensure all values are strings and handle null/undefined
          const markerName = String(marker.marker_name || marker.name || '');
          const markerValue = String(marker.value || '');
          const markerUnit = String(marker.unit || '');
          
          const education = await getBiomarkerEducation(
            markerName,
            markerValue,
            markerUnit,
            userConditions,
            userAllergies
          );
          return { index, education };
        });

        // Load SNP education data
        const snpPromises = snps.map(async (snp, index) => {
          // Ensure all values are strings and handle null/undefined
          const snpId = String(snp.snp_id || snp.rsid || '');
          const geneName = String(snp.gene_name || snp.gene || '');
          const genotype = String(snp.genotype || snp.allele || '');
          
          const education = await getSNPEducation(
            snpId,
            geneName,
            genotype,
            userConditions,
            userAllergies
          );
          return { index, education };
        });

        // Wait for all data to load
        const [biomarkerResults, snpResults] = await Promise.all([
          Promise.all(biomarkerPromises),
          Promise.all(snpPromises)
        ]);

        // Convert to name-based objects instead of index-based
        const biomarkerData: EducationData = {};
        biomarkerResults.forEach(({ index, education }) => {
          const marker = biomarkers[index];
          const markerName = marker.marker_name || marker.name;
          if (markerName) {
            biomarkerData[markerName] = education;
          }
        });

        const snpData: EducationData = {};
        snpResults.forEach(({ index, education }) => {
          const snp = snps[index];
          const snpKey = snp.snp_id || snp.rsid || `${snp.gene_name}_${index}`;
          if (snpKey) {
            snpData[snpKey] = education;
            // Also store by gene name for fallback
            if (snp.gene_name) {
              snpData[snp.gene_name] = education;
            }
          }
        });

        setBiomarkerEducation(biomarkerData);
        setSnpEducation(snpData);
      } catch (error) {
        console.error('Error loading education data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEducationData();
  }, [biomarkers, snps, userConditions, userAllergies]);

  return {
    biomarkerEducation,
    snpEducation,
    loading
  };
}; 