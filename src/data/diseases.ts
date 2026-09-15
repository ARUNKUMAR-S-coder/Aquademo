import { DiseaseInfo } from '../types';

export const FISH_DISEASES: Record<number, DiseaseInfo> = {
  0: {
    id: 0,
    name: 'Bacterial Red disease',
    commonName: 'Hemorrhagic Septicemia / Red Spot',
    scientificCategory: 'Bacterial',
    severity: 'critical',
    shortDescription: 'Severe systemic bacteremia characterized by cutaneous hemorrhages, dermal ulcerations, and blood-engorged fin bases.',
    pathogen: 'Aeromonas hydrophila / Pseudomonas spp.',
    clinicalSigns: [
      'Subcutaneous petechial hemorrhages along the ventral abdominal wall',
      'Hyperemic, blood-streaked fins and congestion at fin bases',
      'Ulcerative lesions penetrating into skeletal musculature',
      'Lethargy, abnormal swimming posture, and surface gasping'
    ],
    immediateActions: [
      'Isolate all affected fish in a designated quarantine tank immediately',
      'Execute a 40% clean water exchange with rapid dechlorination',
      'Disinfect all shared nets, siphons, and viewing buckets with 200 ppm iodophor'
    ],
    treatmentOptions: [
      'Oxytetracycline dihydrate medicated feed (55-75 mg/kg fish biomass/day for 10 days)',
      'Short-duration bath treatment in potassium permanganate (2 mg/L for 4 hours)',
      'Broad-spectrum antimicrobial baths (Florfenicol administered under veterinary supervision)'
    ],
    waterQualityFocus: [
      'Total Ammonia Nitrogen (TAN) < 0.02 mg/L',
      'Dissolved Oxygen > 6.5 mg/L',
      'Nitrite (NO2) < 0.1 mg/L',
      'pH Stability: 6.8 - 7.6'
    ]
  },
  1: {
    id: 1,
    name: 'Bacterial diseases - Aeromoniasis',
    commonName: 'Aeromonas Septicemia / Motile Aeromonad Infection (MAS)',
    scientificCategory: 'Bacterial',
    severity: 'high',
    shortDescription: 'Invasive opportunistic infection producing ascites (dropsy), exophthalmia (pop-eye), and scale protrusion.',
    pathogen: 'Aeromonas hydrophila complex',
    clinicalSigns: [
      'Fluid accumulation in the coelomic peritoneal cavity (dropsy / swollen abdomen)',
      'Unilateral or bilateral exophthalmia (corneal protrusion / pop-eye)',
      'Erect, bristling scales resembling a pinecone (scale edematous protrusion)',
      'Focal cutaneous necrosis and cloacal inflammation'
    ],
    immediateActions: [
      'Stop standard feeding immediately to reduce metabolic and organic waste load',
      'Separate visibly dropsical specimens to prevent waterborne pathogen amplification',
      'Verify biological filter integrity and optimize mechanical aeration'
    ],
    treatmentOptions: [
      'Enrofloxacin or Oxytetracycline medicated gel diets formulated under veterinary oversight',
      'Salt dip immersion (1.5-2.0% uniodized salt for 10-15 minutes) to alleviate osmotic stress',
      'Kanamycin sulfate bath (25-30 mg/L) combined with nitrofurazone in hospital tanks'
    ],
    waterQualityFocus: [
      'Organic sediment reduction via siphon gravel cleaning',
      'Dissolved Oxygen > 6.0 mg/L',
      'Water temperature control (avoid sudden upward spikes)'
    ]
  },
  2: {
    id: 2,
    name: 'Bacterial gill disease',
    commonName: 'Bacterial Gill Disease (BGD)',
    scientificCategory: 'Bacterial',
    severity: 'high',
    shortDescription: 'Filamentous bacterial colonization of gill lamellae leading to respiratory distress, mucus hypersecretion, and asphyxiation.',
    pathogen: 'Flavobacterium branchiophilum',
    clinicalSigns: [
      'Opercular flaring with accelerated buccal pumping and rapid respiration',
      'Fish gathering at oxygen-rich water inlets or gasping at the meniscus (piping)',
      'Swollen, mottled, pale or hyperemic gill filaments matted with excessive mucus',
      'Loss of appetite, sluggish schooling, and dark body pigmentation'
    ],
    immediateActions: [
      'Increase supplemental aeration immediately via fine-pore ceramic diffusers',
      'Clean all mechanical filters to purge suspended organic particulates',
      'Perform a 30% water renewal with pre-conditioned water'
    ],
    treatmentOptions: [
      'Chloramine-T bath (8.5 - 12 mg/L for 1 hour with active monitoring of water hardness)',
      'Hydrogen peroxide bath (35% technical grade at 100-250 mg/L for 30 minutes)',
      'Benzalkonium chloride (1-2 mg/L for 1 hour under soft-water precautions)'
    ],
    waterQualityFocus: [
      'Dissolved Oxygen > 7.0 mg/L (Critical threshold)',
      'Suspended solids < 15 mg/L',
      'Unionized Ammonia (NH3) strictly < 0.01 mg/L'
    ]
  },
  3: {
    id: 3,
    name: 'Fungal diseases Saprolegniasis',
    commonName: 'Cotton Wool Disease / Water Mold',
    scientificCategory: 'Fungal',
    severity: 'moderate',
    shortDescription: 'Invasive oomycete colonization forming conspicuous white, grey, or brownish cotton-like mycelial mats on epidermis and fins.',
    pathogen: 'Saprolegnia parasitica / Achlya spp. (Oomycota)',
    clinicalSigns: [
      'Superficial cotton-like mycelial tufts spreading across flank, head, or fin margins',
      'Integumentary erosion with underlying dermis necrosis and loss of epidermal mucous barrier',
      'Lethargy, rubbing against aquarium substrate or pond walls (flashing)',
      'Secondary bacterial invasion into exposed sub-dermal muscular tissue'
    ],
    immediateActions: [
      'Gradually increase water temperature by 2-3°C if within safe biological species limits',
      'Gently aspirate or net surface detritus that harbors saprophytic spores',
      'Isolate severely affected fish to prevent secondary cannibalism or fin-nipping'
    ],
    treatmentOptions: [
      'Formalin bath (150-250 ppm for 60 minutes with vigorous aeration)',
      'Sodium chloride prolonged bath (3-5 g/L continuous for 5-7 days)',
      'Topical application of povidone-iodine swab directly onto isolated lesions'
    ],
    waterQualityFocus: [
      'Decomposing organic matter removal',
      'Water temperature stability (prevent sudden chilling)',
      'UV sterilization of recirculating water loops'
    ]
  },
  4: {
    id: 4,
    name: 'Healthy Fish',
    commonName: 'Normal Physiological Specimen',
    scientificCategory: 'Healthy',
    severity: 'healthy',
    shortDescription: 'Physiologically sound specimen exhibiting intact epidermal mucous barrier, clear ocular lenses, vibrant coloration, and alert posture.',
    pathogen: 'None detected (Normal microflora)',
    clinicalSigns: [
      'Evenly aligned, smooth, intact scales with glistening iridescent cuticle',
      'Clear transparent cornea with no cloudiness, hemorrhage, or protrusion',
      'Deep reddish-pink gill lamellae with uniform comb-like filament architecture',
      'Erect, intact fin rays free of fraying, discoloration, or petechiae',
      'Energetic schooling behavior and responsive rheotaxis'
    ],
    immediateActions: [
      'Maintain standard strict biosecurity protocols for feed and water inputs',
      'Keep quarantine protocol active for all newly introduced broodstock or fingerlings',
      'Log routine visual monitoring and water parameter tests twice daily'
    ],
    treatmentOptions: [
      'No medical intervention required',
      'Provide nutritionally balanced species-appropriate feed with stabilized vitamin C/E',
      'Routine probiotic water supplementation to preserve competitive beneficial microbiota'
    ],
    waterQualityFocus: [
      'Maintain stable baseline parameters suited for specific cultured species',
      'Regular dissolved oxygen, temperature, and ammonia monitoring',
      'Bi-weekly partial water renewals'
    ]
  },
  5: {
    id: 5,
    name: 'Parasitic diseases',
    commonName: 'Ichthyophthiriasis / Dactylogyrus / Trichodiniasis',
    scientificCategory: 'Parasitic',
    severity: 'high',
    shortDescription: 'Ectoparasitic or endoparasitic infestation causing white cysts, gill irritation, flashing behaviors, and cutaneous slime overproduction.',
    pathogen: 'Ichthyophthirius multifiliis / Trichodina / Monogenean trematodes',
    clinicalSigns: [
      'Pinpoint white macroscopic nodules (0.5-1.0 mm) scattered across skin, fins, and gills (Ich)',
      'Vigorous scratching/rubbing against abrasive surfaces (flashing behavior)',
      'Excessive bluish-grey cutaneous mucus secretion causing cloudy skin',
      'Fin clamping, listless drifting near water outflow, and rapid gill beat frequency'
    ],
    immediateActions: [
      'Elevate water temperature to 28-30°C for 5-7 days to interrupt the parasite tomont reproduction cycle (if species permits)',
      'Perform substrate vacuuming to siphon encysted tomonts off the tank floor',
      'Turn off active carbon filtration before introducing therapeutic antiparasitic agents'
    ],
    treatmentOptions: [
      'Formalin and Malachite green combined bath (0.05 mg/L malachite + 15 mg/L formalin)',
      'Praziquantel bath (2-5 mg/L for 24 hours) for monogenean gill and skin flukes',
      'Copper sulfate continuous bath (0.15 - 0.20 mg/L Cu2+ tightly controlled with test kits)'
    ],
    waterQualityFocus: [
      'Substrate cleanliness and mechanical filtration to siphon encysted tomites',
      'Water alkalinity > 50 mg/L CaCO3 when dosing copper',
      'Continuous dissolved oxygen > 6.0 mg/L'
    ]
  },
  6: {
    id: 6,
    name: 'Viral diseases White tail disease',
    commonName: 'White Tail Disease (WTD) / Viral Muscle Necrosis',
    scientificCategory: 'Viral',
    severity: 'critical',
    shortDescription: 'Viral pathogen causing severe progressive muscular necrosis of the caudal peduncle, presenting as chalky white opaque tail syndrome.',
    pathogen: 'Macrobrachium rosenbergii nodavirus (MrNV) & Extra Small Virus (XSV)',
    clinicalSigns: [
      'Distinct milky white, chalky opacity appearing in the caudal peduncle musculature',
      'Progressive paralysis of the tail fin with impaired swimming mobility',
      'Softening and liquefactive degeneration of the posterior abdominal muscle bundles',
      'Rapid mortality reaching 80-100% within 48-72 hours of symptom onset in juveniles'
    ],
    immediateActions: [
      'Implement total strict quarantine lock-down on the affected culture system',
      'Humanely cull severely infected moribund specimens to prevent horizontal viral transmission',
      'Sterilize all effluent water with 50-100 ppm active chlorine before environmental discharge',
      'Immediately alert aquaculture regulatory and disease surveillance authorities'
    ],
    treatmentOptions: [
      'No specific curative antiviral pharmaceutical available for teleost/crustacean nodaviruses',
      'Supportive biosecurity: immunostimulant dietary additives (beta-glucans, peptidoglycans)',
      'Post-outbreak total drainage, desiccation, and quicklime (CaO at 500 kg/ha) disinfection'
    ],
    waterQualityFocus: [
      'Strict zero-effluent containment during active outbreak',
      'Avoid high stocking density and thermal stress triggers',
      'Rigorous water filtration with 1-micron mechanical screens and UV sterilization'
    ]
  }
};
