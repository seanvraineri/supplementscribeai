import { useState, useEffect } from 'react';
// import { getBiomarkerEducation, getSNPEducation } from '@/lib/analysis-helpers';

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
    // TEMPORARILY DISABLED - This was causing continuous expensive AI calls
    // TODO: Implement batched or cached education loading
    console.log('Education data loading temporarily disabled to prevent excessive AI calls');
    console.log(`Would load education for ${biomarkers.length} biomarkers and ${snps.length} SNPs`);
    
    // Set loading to false immediately
    setLoading(false);
    
    // Provide empty education data for now
    setBiomarkerEducation({});
    setSnpEducation({});
    
    return;

    // ORIGINAL CODE (commented out):
    /*
    const loadEducationData = async () => {
      if (biomarkers.length === 0 && snps.length === 0) return;
      
      setLoading(true);
      
      try {
        // Load biomarker education data
        const biomarkerPromises = biomarkers.map(async (marker, index) => {
          const education = await getBiomarkerEducation(
            marker.marker_name,
            marker.value,
            marker.unit,
            userConditions,
            userAllergies
          );
          return { index, education };
        });

        // Load SNP education data
        const snpPromises = snps.map(async (snp, index) => {
          const education = await getSNPEducation(
            snp.snp_id,
            snp.gene_name,
            snp.genotype || snp.allele,
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

        // Convert to indexed objects
        const biomarkerData: EducationData = {};
        biomarkerResults.forEach(({ index, education }) => {
          biomarkerData[index] = education;
        });

        const snpData: EducationData = {};
        snpResults.forEach(({ index, education }) => {
          snpData[index] = education;
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
    */
  }, [biomarkers, snps, userConditions, userAllergies]);

  return {
    biomarkerEducation,
    snpEducation,
    loading
  };
}; 