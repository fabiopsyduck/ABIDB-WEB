// =====================================================================
// 1. VARIÁVEIS GLOBAIS E ESTADO
// =====================================================================
let currentLang = 'pt'; // Idioma padrão

// --- MAPAS DE PESOS PARA ORDENAÇÃO (TIE-BREAKERS) ---
// --- MAPAS DE PESOS PARA ORDENAÇÃO (TIE-BREAKERS) ---
const sortWeights = {
    PoderFogo: { "Low":1, "Mid-Low":2, "Medium":3, "Mid-High":4, "High":5, "Ultra High":6 },
    TipoCano: { "Default -":1, "CustomD-":1, "FB D-":1, "FBNMD-":1, "R+ WD-":1, "D+ R+ WD-":1, "Default":2, "Custom":2, "FB":2, "FBNM":2, "CustomD+":4, "FB D+":4, "FBNMD+":4, "Default +":5, "R+":6, "D+":6, "R+ WD+":7, "D+ R+":7, "D+ R+ WD+":8 },
    ModoDisparo: { "Pump-Action":1, "Bolt-Action":1, "3-RB":2, "Semi":3, "Semi, 3-RB":3, "Full":4, "Semi, Full":4, "2-RB, Semi, Full":4, "3-RB, Semi, Full":4 },
    ChanceFerir: { "//////":0, "Low":1, "Medium":2, "High":3 },
    
    AlcanceGrenade: { "//////":0, "Small":1, "Standard":2, "Large":3, "Very Large":4 },
    DanoBlindGrenade: { "//////":0, "Standard":1, "Mid-High":2 },
    PenetracaoGrenade: { "//////":0, "Standard":1, "Mid-High":2 },
    FragmentosGrenade: { "//////":0, "Small":1, "Large":2 },
    TipoFragsGrenade: { "//////":0, "Iron Piece":1, "Steel Piece":2 },

    BloqueioHelmet: { "//////":0, "Low":1, "Moderate":2, "Severe":3 },
    RicocheteHelmet: { "//////":0, "Low":1, "Medium":2, "High":3 },
    AcessorioHelmet: { "//////":0, "TE":1, "Mask":2, "Mask, TE":3 },
    ReducaoHelmet: { "//////":0, "Bad":1, "Medium":2, "Strong":3 },

    GasMaskEffect: { "//////":0, "Bad":1, "Medium":2, "Strong":3 },
    HeadsetAudio: { "//////":0, "Bad":1, "Medium":2, "Strong":3 },

    AreaArmor: {
        "//////": 0,
        "Chest": 1,
        "Chest, Upper Abdomen": 2,
        "Chest, Shoulder, Upper Abdomen": 3,
        "Chest, Upper Abdomen, Lower Abdomen": 4,
        "Chest, Shoulder, Upper Abdomen, Lower Abdomen": 5
    },
    
    // Pesos EXCLUSIVOS para Coletes Blindados (Rigs)
    AreaArmoredRig: {
        "//////": 0,
        "Chest": 1,
        "Chest, Upper Abdomen": 2,
        "Chest, Upper Abdomen, Lower Abdomen": 3,
        "Chest, Shoulder, Upper Abdomen, Lower Abdomen": 4
    }
};

// ----------------------------------------------------------
// 2. MOTOR DE BANCO DE DADOS (FETCH CSV)
// =====================================================================
const db = {
    weapons: [],
    ammo: [],
    grenades: [],
    helmets: [],
    masks: [],
    gasMasks: [],
    headsets: [],
    bodyArmor: [],
    armoredRigs: [],
    unarmoredRigs: [],
    backpacks: [],
    food_items: [],
    food_beverages: [],
    maskCompatibility: [],
    damageData: [], // <-- NOVO: Banco de Danos e Alcances
    // SUB-BANCOS DA FARMÁCIA
    medical_painkillers: [],
    medical_bandages: [],
    medical_surgical: [],
    medical_nebulizers: [],
    medical_medkits: [],
    medical_stimulants: []
};

async function fetchAndParseCSV(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${filePath}: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        return parseCSV(csvText);
        
    } catch (error) {
        console.error("Erro na leitura do CSV:", error);
        return [];
    }
}

function parseCSV(text) {
    const cleanText = text.replace(/\r/g, '');
    const lines = cleanText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(val => val.replace(/^"|"$/g, '').trim());
        let rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = values[index] || "";
        });
        data.push(rowObject);
    }
    
    return data;
}

async function loadDatabases() {
    const gridInfo = document.getElementById('grid-placeholder-1');
    if(gridInfo) gridInfo.textContent = translations[currentLang].msgDownloading;
    
    const loadPromises = [
        fetchAndParseCSV('database/Weapons.csv').then(data => db.weapons = data),
        fetchAndParseCSV('database/Ammo.csv').then(data => db.ammo = data),
        fetchAndParseCSV('database/Throwables.csv').then(data => db.grenades = data),
        fetchAndParseCSV('database/Helmets.csv').then(data => db.helmets = data),
        fetchAndParseCSV('database/Masks.csv').then(data => db.masks = data),
        fetchAndParseCSV('database/MaskCompatibility.csv').then(data => db.maskCompatibility = data),
        fetchAndParseCSV('database/GasMasks.csv').then(data => db.gasMasks = data),
        fetchAndParseCSV('database/Headsets.csv').then(data => db.headsets = data),
        fetchAndParseCSV('database/Bodyarmors.csv').then(data => db.bodyArmor = data),
        fetchAndParseCSV('database/ArmoredRigs.csv').then(data => db.armoredRigs = data),
        fetchAndParseCSV('database/Unarmoredrigs.csv').then(data => db.unarmoredRigs = data),
        fetchAndParseCSV('database/Backpacks.csv').then(data => db.backpacks = data),
        fetchAndParseCSV('database/Food.csv').then(data => db.food_items = data),
        fetchAndParseCSV('database/Beverages.csv').then(data => db.food_beverages = data),
        fetchAndParseCSV('database/DamageRange.csv').then(data => db.damageData = data), // <-- NOVO CARREGAMENTO
        fetchAndParseCSV('database/Painkillers.csv').then(data => db.medical_painkillers = data),
        fetchAndParseCSV('database/Bandages.csv').then(data => db.medical_bandages = data),
        fetchAndParseCSV('database/Surgicalkit.csv').then(data => db.medical_surgical = data),
        fetchAndParseCSV('database/Nebulizers.csv').then(data => db.medical_nebulizers = data),
        fetchAndParseCSV('database/Medicalkit.csv').then(data => db.medical_medkits = data),
        fetchAndParseCSV('database/Stimulants.csv').then(data => db.medical_stimulants = data)
    ];

    await Promise.all(loadPromises);
    console.log("Todos os bancos de dados carregados na memória:", db);
    
    // --- LIGA O NOVO MOTOR AQUI ---
    if (typeof calibrateSimulatorLayout === "function") calibrateSimulatorLayout();
    
    if(gridInfo) gridInfo.textContent = translations[currentLang].msgDbReady;
}


// =====================================================================
// 3. INICIALIZAÇÃO DA APLICAÇÃO
// =====================================================================
async function initApp(lang) {
    currentLang = lang;
    applyLanguage(lang);
    
    document.getElementById('language-overlay').style.display = 'none';
    document.getElementById('app-container').classList.remove('hidden');

    await loadDatabases();
}


// =====================================================================
// 4. APLICAÇÃO DAS TRADUÇÕES E NAVEGAÇÃO
// =====================================================================
function applyLanguage(lang) {
    const t = translations[lang];
    
    // Menu Lateral
    document.getElementById('app-title').textContent = t.appTitle;
    document.getElementById('nav-search').textContent = t.navSearch;
    
    if (document.getElementById('lbl-menu-tools')) document.getElementById('lbl-menu-tools').textContent = t.lblMenuTools;
    if (document.getElementById('lbl-menu-knowledge')) document.getElementById('lbl-menu-knowledge').textContent = t.lblMenuKnowledge;
    
    // Tradução dos menus
    document.getElementById('nav-compare').textContent = t.navCompareWeapons;
    if (document.getElementById('nav-damage')) document.getElementById('nav-damage').textContent = t.navDamage;
    if (document.getElementById('nav-mask-comp')) document.getElementById('nav-mask-comp').innerHTML = t.navMaskComp;
    
    if (document.getElementById('nav-simulator')) document.getElementById('nav-simulator').innerHTML = t.navSimulator;
    
    document.getElementById('nav-lang-toggle').textContent = t.toggleLangBtn;
    
    // Aba 1: Busca
    document.getElementById('title-search').textContent = t.titleSearch;
    if (document.getElementById('desc-search')) document.getElementById('desc-search').textContent = t.descSearch;
    if (document.getElementById('lbl-category')) document.getElementById('lbl-category').textContent = t.lblCategory;
    if (document.getElementById('lbl-criteria')) document.getElementById('lbl-criteria').textContent = t.lblCriteria;
    if (document.getElementById('lbl-order')) document.getElementById('lbl-order').textContent = t.lblOrder;
    
    // --- NOVO: Tradução do Crescente/Decrescente ---
    if (document.getElementById('opt-asc')) document.getElementById('opt-asc').textContent = t.orderAsc;
    if (document.getElementById('opt-desc')) document.getElementById('opt-desc').textContent = t.orderDesc;

    if (document.getElementById('btn-save')) document.getElementById('btn-save').textContent = t.btnSave;
    if (document.getElementById('lbl-count')) document.getElementById('lbl-count').textContent = t.lblCount;
    
    // --- NOVO: Tradução do Botão Voltar da Grade ---
    if (document.getElementById('btn-back-grid')) document.getElementById('btn-back-grid').textContent = t.btnSearchBack;

    // --- NOVO: Tradução dos Botões do Modal de Filtros ---
    if (document.getElementById('btn-filter-reset')) document.getElementById('btn-filter-reset').textContent = t.btnFilterReset;
    if (document.getElementById('btn-filter-confirm')) document.getElementById('btn-filter-confirm').textContent = t.btnFilterConfirm;
    if (document.getElementById('btn-filter-cancel')) document.getElementById('btn-filter-cancel').textContent = t.btnFilterCancel;

    const btnFilter = document.getElementById('btn-filter');
    if (btnFilter) {
        btnFilter.textContent = t.btnFilter;
        btnFilter.title = t.tooltipFilter;
    }
    
    // TRADUÇÃO DOS BOTÕES DO MENU PRINCIPAL DE CATEGORIAS
    if (document.getElementById('btn-cat-weapons')) document.getElementById('btn-cat-weapons').textContent = t.titlesCategory.weapons;
    if (document.getElementById('btn-cat-ammo')) document.getElementById('btn-cat-ammo').textContent = t.titlesCategory.ammo;
    if (document.getElementById('btn-cat-grenades')) document.getElementById('btn-cat-grenades').textContent = t.titlesCategory.grenades;
    if (document.getElementById('btn-cat-helmets')) document.getElementById('btn-cat-helmets').textContent = t.titlesCategory.helmets;
    if (document.getElementById('btn-cat-masks')) document.getElementById('btn-cat-masks').textContent = t.titlesCategory.masks;
    if (document.getElementById('btn-cat-gasmasks')) document.getElementById('btn-cat-gasmasks').textContent = t.titlesCategory.gasMasks;
    if (document.getElementById('btn-cat-headsets')) document.getElementById('btn-cat-headsets').textContent = t.titlesCategory.headsets;
    if (document.getElementById('btn-cat-bodyarmor')) document.getElementById('btn-cat-bodyarmor').textContent = t.titlesCategory.bodyArmor;
    if (document.getElementById('btn-cat-armoredrigs')) document.getElementById('btn-cat-armoredrigs').textContent = t.titlesCategory.armoredRigs;
    if (document.getElementById('btn-cat-unarmoredrigs')) document.getElementById('btn-cat-unarmoredrigs').textContent = t.titlesCategory.unarmoredRigs;
    if (document.getElementById('btn-cat-backpacks')) document.getElementById('btn-cat-backpacks').textContent = t.titlesCategory.backpacks;
    if (document.getElementById('btn-cat-medical')) document.getElementById('btn-cat-medical').textContent = t.titlePharmSearch;
    if (document.getElementById('btn-cat-food')) document.getElementById('btn-cat-food').textContent = t.titleFoodSearch;
    
    // TRADUÇÕES DOS MENUS DE SUBCATEGORIAS
    if (document.getElementById('lbl-medical-cat')) document.getElementById('lbl-medical-cat').textContent = t.lblMedicalCat;
    if (document.getElementById('opt-med-painkillers')) document.getElementById('opt-med-painkillers').textContent = t.optMedPainkillers;
    if (document.getElementById('opt-med-bandages')) document.getElementById('opt-med-bandages').textContent = t.optMedBandages;
    if (document.getElementById('opt-med-surgical')) document.getElementById('opt-med-surgical').textContent = t.optMedSurgical;
    if (document.getElementById('opt-med-nebulizers')) document.getElementById('opt-med-nebulizers').textContent = t.optMedNebulizers;
    if (document.getElementById('opt-med-medkits')) document.getElementById('opt-med-medkits').textContent = t.optMedMedkits;
    if (document.getElementById('opt-med-stimulants')) document.getElementById('opt-med-stimulants').textContent = t.optMedStimulants;

    if (document.getElementById('lbl-food-cat')) document.getElementById('lbl-food-cat').textContent = t.lblFoodCat;
    if (document.getElementById('opt-food-all')) document.getElementById('opt-food-all').textContent = t.optFoodAll;
    if (document.getElementById('opt-food-items')) document.getElementById('opt-food-items').textContent = t.optFoodItems;
    if (document.getElementById('opt-food-beverages')) document.getElementById('opt-food-beverages').textContent = t.optFoodBeverages;

    if (document.getElementById('lbl-ammo-cat')) document.getElementById('lbl-ammo-cat').textContent = t.lblAmmoCat;
    if (document.getElementById('lbl-ammo-wep')) document.getElementById('lbl-ammo-wep').textContent = t.lblAmmoWep;
    if (document.getElementById('btnAmmoReset')) document.getElementById('btnAmmoReset').textContent = t.btnAmmoReset;
    
    const btnExportSearch = document.getElementById('btn-export-image');
    if (btnExportSearch) {
        btnExportSearch.innerHTML = t.msgExportResults;
        btnExportSearch.title = t.tooltipExportTable;
    }

    // =========================================================================
    // TRADUÇÕES DA TELA DE COMPARAÇÃO DE ARMAS
    // =========================================================================
    if (document.getElementById('title-compare')) document.getElementById('title-compare').textContent = t.titleCompareWeapons;
    
    const lblCompTitle = document.getElementById('lbl-comp-selected-title');
    if (lblCompTitle) {
        lblCompTitle.innerHTML = `${t.lblCompSelectedTitle} (<span id="comp-selected-count">${typeof compSelectedWeapons !== 'undefined' ? compSelectedWeapons.length : 0}</span>/15)`;
    }
    
    const lblCompEmpty = document.getElementById('lbl-comp-empty');
    if (lblCompEmpty) lblCompEmpty.textContent = t.lblCompEmpty;
    if (document.getElementById('btn-comp-compare')) document.getElementById('btn-comp-compare').textContent = t.btnCompCompare;
    if (document.getElementById('btn-comp-clear-all')) document.getElementById('btn-comp-clear-all').textContent = t.btnCompClearAll;

    if (document.getElementById('lbl-comp-filter-title')) document.getElementById('lbl-comp-filter-title').textContent = t.lblCompFilterTitle;
    if (document.getElementById('btn-comp-reset-filters')) document.getElementById('btn-comp-reset-filters').textContent = t.btnCompResetFilters;
    if (document.getElementById('lbl-comp-results-title')) document.getElementById('lbl-comp-results-title').textContent = t.lblCompResultsTitle;
    
    const btnCompExport = document.getElementById('btn-comp-export');
    if (btnCompExport) {
        btnCompExport.innerHTML = t.msgExportResults;
        btnCompExport.title = t.tooltipExportComp;
    }
    if (document.getElementById('btn-comp-back')) document.getElementById('btn-comp-back').textContent = t.btnCompBack;
    
    // =========================================================================
    // TRADUÇÕES DA TELA DE LIMITES DE DANO (GRÁFICO)
    // =========================================================================
    if (document.getElementById('title-damage-chart')) document.getElementById('title-damage-chart').textContent = t.titleDamageChart;
    if (document.getElementById('lbl-dmg-class')) document.getElementById('lbl-dmg-class').textContent = t.lblDmgClass;
    if (document.getElementById('lbl-dmg-weapon')) document.getElementById('lbl-dmg-weapon').textContent = t.lblDmgWeapon;
    if (document.getElementById('lbl-dmg-ammo')) document.getElementById('lbl-dmg-ammo').textContent = t.lblDmgAmmo;
    
    const lblChartInstruction = document.getElementById('dmg-chart-instruction');
    if (lblChartInstruction && t.dmgDynamicTexts && t.dmgDynamicTexts.chartInstruction) {
        lblChartInstruction.textContent = t.dmgDynamicTexts.chartInstruction;
    }

    const btnDmgAdd = document.getElementById('btn-dmg-add');
    if (btnDmgAdd) {
        if (!btnDmgAdd.disabled || (typeof dmgActiveChartCombos !== 'undefined' && dmgActiveChartCombos.length < 5 && btnDmgAdd.textContent !== t.dmgCountFull)) {
            btnDmgAdd.textContent = t.btnDmgAdd;
        } else if (typeof dmgActiveChartCombos !== 'undefined' && dmgActiveChartCombos.length >= 5) {
            btnDmgAdd.textContent = t.dmgCountFull;
        }
    }
    
    if (document.getElementById('btn-dmg-clear')) document.getElementById('btn-dmg-clear').textContent = t.btnDmgClear;
    
    if (document.getElementById('lbl-dmg-count')) {
        let restantes = 5 - (typeof dmgActiveChartCombos !== 'undefined' ? dmgActiveChartCombos.length : 0);
        document.getElementById('lbl-dmg-count').textContent = restantes + t.dmgCountSuffix;
    }
    
    const btnDmgExport = document.getElementById('btn-dmg-export');
    if (btnDmgExport) {
        btnDmgExport.innerHTML = t.msgExportResults;
        btnDmgExport.title = t.tooltipExportChart;
    }

    // =========================================================================
    // TRADUÇÕES DA TELA DE COMPATIBILIDADE DE MÁSCARAS
    // =========================================================================
    if (document.getElementById('title-mask-comp')) {
        document.getElementById('title-mask-comp').textContent = t.titleMaskComp;
    }
    
    const btnMaskExport = document.getElementById('btn-mask-export');
    if (btnMaskExport) {
        btnMaskExport.innerHTML = t.msgExportResults;
        btnMaskExport.title = t.tooltipExportMasks;
    }
    
    if (document.getElementById('btn-mask-filter')) document.getElementById('btn-mask-filter').textContent = t.btnMaskFilter;
    if (document.getElementById('btn-mask-reset-quick')) document.getElementById('btn-mask-reset-quick').textContent = t.btnMaskResetQuick;
    
    if (t.maskFilterModal) {
        if (document.getElementById('lbl-mask-modal-title')) document.getElementById('lbl-mask-modal-title').textContent = t.maskFilterModal.title;
        if (document.getElementById('lbl-mask-modal-desc')) document.getElementById('lbl-mask-modal-desc').innerHTML = t.maskFilterModal.desc;
        if (document.getElementById('lbl-mask-modal-col')) document.getElementById('lbl-mask-modal-col').textContent = t.maskFilterModal.columnTitle;
        if (document.getElementById('btn-mask-modal-clean')) document.getElementById('btn-mask-modal-clean').textContent = t.maskFilterModal.btnClean;
        if (document.getElementById('btn-mask-modal-apply')) document.getElementById('btn-mask-modal-apply').textContent = t.maskFilterModal.btnApply;
        if (document.getElementById('btn-mask-modal-cancel')) document.getElementById('btn-mask-modal-cancel').textContent = t.maskFilterModal.btnCancel;
    }
    
    if (typeof renderMaskCompatibilityUI === "function" && document.getElementById('mask-comp-section') && !document.getElementById('mask-comp-section').classList.contains('hidden-section')) {
        renderMaskCompatibilityUI();
    }

    if (t.dmgInfoModal) {
        if (document.getElementById('btn-dmg-info-icon')) document.getElementById('btn-dmg-info-icon').title = t.dmgInfoModal.tooltip;
        if (document.getElementById('lbl-dmg-info-title')) document.getElementById('lbl-dmg-info-title').textContent = t.dmgInfoModal.title;
        if (document.getElementById('lbl-dmg-info-p1')) document.getElementById('lbl-dmg-info-p1').innerHTML = t.dmgInfoModal.p1;
        if (document.getElementById('lbl-dmg-info-p2')) document.getElementById('lbl-dmg-info-p2').innerHTML = t.dmgInfoModal.p2;
        if (document.getElementById('lbl-dmg-info-p3')) document.getElementById('lbl-dmg-info-p3').innerHTML = t.dmgInfoModal.p3;
        if (document.getElementById('lbl-dmg-info-p4')) document.getElementById('lbl-dmg-info-p4').innerHTML = t.dmgInfoModal.p4;
        if (document.getElementById('btn-dmg-info-close')) document.getElementById('btn-dmg-info-close').textContent = t.dmgInfoModal.btnClose;
    }

    // ==========================================
    // TRADUÇÃO DO MODAL DO SIMULADOR BALÍSTICO
    // ==========================================
    const btnSimInfo = document.getElementById('btn-sim-info-icon');
    if (btnSimInfo && t.simInfoModal) {
        btnSimInfo.title = t.simInfoModal.tooltip;
        const modalTitle = document.getElementById('sim-modal-title');
        if (modalTitle) modalTitle.textContent = t.simInfoModal.title;
        const p1 = document.getElementById('sim-modal-p1');
        if (p1) p1.innerHTML = t.simInfoModal.p1;
        const p2 = document.getElementById('sim-modal-p2');
        if (p2) p2.innerHTML = t.simInfoModal.p2;
        const p3 = document.getElementById('sim-modal-p3');
        if (p3) p3.innerHTML = t.simInfoModal.p3;
        const btnClose = document.getElementById('btn-sim-modal-close');
        if (btnClose) btnClose.textContent = t.simInfoModal.btnClose;
    }

    // =========================================================================
    // --- NOVO: TRADUÇÕES DO SIMULADOR BALÍSTICO ---
    // =========================================================================
    if (document.getElementById('title-simulator')) document.getElementById('title-simulator').textContent = t.titleSimulator;
    if (document.getElementById('lbl-sim-atk-title')) document.getElementById('lbl-sim-atk-title').textContent = t.lblSimAtkTitle;
    if (document.getElementById('lbl-sim-class')) document.getElementById('lbl-sim-class').textContent = t.lblSimClass;
    if (document.getElementById('lbl-sim-weapon')) document.getElementById('lbl-sim-weapon').textContent = t.lblSimWeapon;
    if (document.getElementById('lbl-sim-ammo')) document.getElementById('lbl-sim-ammo').textContent = t.lblSimAmmo;
    if (document.getElementById('lbl-sim-def-title')) document.getElementById('lbl-sim-def-title').textContent = t.lblSimDefTitle;
    
    // Novo Filtro de Categoria
    if (document.getElementById('lbl-sim-armor-type')) document.getElementById('lbl-sim-armor-type').textContent = t.lblSimArmorType;
    if (document.getElementById('sim-cb-armor-type')) {
        const typeSelect = document.getElementById('sim-cb-armor-type');
        const defaultOpt = typeSelect.querySelector('option[value=""]');
        if (defaultOpt) defaultOpt.textContent = t.simDynamicTexts.selectArmorCategory;
        
        const optHelmets = typeSelect.querySelector('option[value="Helmets"]');
        if (optHelmets) optHelmets.textContent = t.simDynamicTexts.optHelmets;
        
        const optMasks = typeSelect.querySelector('option[value="Masks"]');
        if (optMasks) optMasks.textContent = t.simDynamicTexts.optMasks;
        
        const optBodyArmor = typeSelect.querySelector('option[value="BodyArmor"]');
        if (optBodyArmor) optBodyArmor.textContent = t.simDynamicTexts.optBodyArmor;
        
        const optRigs = typeSelect.querySelector('option[value="ArmoredRigs"]');
        if (optRigs) optRigs.textContent = t.simDynamicTexts.optRigs;
        
        const optAll = typeSelect.querySelector('option[value="AllArmors"]');
        if (optAll) optAll.textContent = t.simDynamicTexts.optAll;
    }

    if (document.getElementById('lbl-sim-armor')) document.getElementById('lbl-sim-armor').textContent = t.lblSimArmor;
    if (document.getElementById('lbl-sim-armor-class')) document.getElementById('lbl-sim-armor-class').textContent = t.lblSimArmorClass;
    if (document.getElementById('lbl-sim-armor-dur')) document.getElementById('lbl-sim-armor-dur').textContent = t.lblSimArmorDur;
    
    // Atualiza o texto do Placeholder caso a tela esteja vazia
    const simResContainer = document.getElementById('sim-result-container');
    const simPlaceholder = document.getElementById('sim-placeholder-text');
    if (simPlaceholder && simResContainer && simResContainer.style.display === 'none') {
        simPlaceholder.textContent = t.simPlaceholderText;
    }
    
    // Tradução dos Status de Equipamento (Projétil e Blindagem)
    if (document.getElementById('lbl-sim-proj-status')) document.getElementById('lbl-sim-proj-status').textContent = t.lblSimProjStatus;
    if (document.getElementById('lbl-sim-pierce-level')) document.getElementById('lbl-sim-pierce-level').textContent = t.lblSimPierceLevel;
    if (document.getElementById('lbl-sim-exact-pen')) document.getElementById('lbl-sim-exact-pen').textContent = t.lblSimExactPen;
    if (document.getElementById('lbl-sim-armor-dmg')) document.getElementById('lbl-sim-armor-dmg').textContent = t.lblSimArmorDmg; 
    if (document.getElementById('lbl-sim-base-dmg')) document.getElementById('lbl-sim-base-dmg').textContent = t.lblSimBaseDmg;
    if (document.getElementById('lbl-sim-blunt-dmg')) document.getElementById('lbl-sim-blunt-dmg').textContent = t.lblSimBluntDmg;
    
    if (document.getElementById('lbl-sim-armor-status')) document.getElementById('lbl-sim-armor-status').textContent = t.lblSimArmorStatus;
    if (document.getElementById('lbl-sim-armor-class-label')) document.getElementById('lbl-sim-armor-class-label').textContent = t.lblSimArmorClassLabel;
    if (document.getElementById('lbl-sim-armor-material-label')) document.getElementById('lbl-sim-armor-material-label').textContent = t.lblSimArmorMaterialLabel;
    if (document.getElementById('lbl-sim-armor-max-dur')) document.getElementById('lbl-sim-armor-max-dur').textContent = t.lblSimArmorMaxDur;
    if (document.getElementById('lbl-sim-armor-cur-dur')) document.getElementById('lbl-sim-armor-cur-dur').textContent = t.lblSimArmorCurDur;
    if (document.getElementById('lbl-sim-armor-areas')) document.getElementById('lbl-sim-armor-areas').textContent = t.lblSimArmorAreas;

    // Tradução dos Títulos de Cabeçalho do Relatório
    if (document.getElementById('lbl-sim-report-title')) document.getElementById('lbl-sim-report-title').textContent = t.lblSimReportTitle;
    
    if (document.getElementById('lbl-sim-rep-weapon-title')) document.getElementById('lbl-sim-rep-weapon-title').textContent = t.lblSimRepWeaponTitle;
    if (document.getElementById('lbl-sim-rep-ammo-title')) document.getElementById('lbl-sim-rep-ammo-title').textContent = t.lblSimRepAmmoTitle;
    if (document.getElementById('lbl-sim-rep-armor-title')) document.getElementById('lbl-sim-rep-armor-title').textContent = t.lblSimRepArmorTitle;

    if (document.getElementById('lbl-sim-durability-state')) document.getElementById('lbl-sim-durability-state').textContent = t.lblSimDurabilityState;

    if (document.getElementById('sim-status-label')) document.getElementById('sim-status-label').textContent = t.lblSimBarTitle;

    // Tradução dos Painéis Retangulares (Dano Inicial e Dano Final)
    if (document.getElementById('lbl-sim-dmg-close-title')) document.getElementById('lbl-sim-dmg-close-title').textContent = t.lblSimDmgCloseTitle;
    if (document.getElementById('lbl-sim-res-pen-close')) document.getElementById('lbl-sim-res-pen-close').innerHTML = t.lblSimResPenClose;
    if (document.getElementById('lbl-sim-res-armor-close')) document.getElementById('lbl-sim-res-armor-close').innerHTML = t.lblSimResArmorClose;
    if (document.getElementById('lbl-sim-res-kill-close')) document.getElementById('lbl-sim-res-kill-close').textContent = t.lblSimResKillClose;
    if (document.getElementById('lbl-sim-res-avgkill-close')) document.getElementById('lbl-sim-res-avgkill-close').textContent = t.lblSimResAvgKill;
    if (document.getElementById('lbl-sim-res-avgkill-far')) document.getElementById('lbl-sim-res-avgkill-far').textContent = t.lblSimResAvgKill;

    if (document.getElementById('lbl-sim-dmg-far-title')) document.getElementById('lbl-sim-dmg-far-title').textContent = t.lblSimDmgFarTitle;
    if (document.getElementById('lbl-sim-res-pen-far')) document.getElementById('lbl-sim-res-pen-far').innerHTML = t.lblSimResPenFar;
    if (document.getElementById('lbl-sim-res-armor-far')) document.getElementById('lbl-sim-res-armor-far').innerHTML = t.lblSimResArmorFar;
    if (document.getElementById('lbl-sim-res-kill-far')) document.getElementById('lbl-sim-res-kill-far').textContent = t.lblSimResKillFar;

    // Tradução do Aviso "Importante" (Pellets)
    if (document.getElementById('lbl-sim-warn-imp')) document.getElementById('lbl-sim-warn-imp').textContent = t.lblSimWarnImp;
    if (document.getElementById('lbl-sim-warn-txt')) document.getElementById('lbl-sim-warn-txt').textContent = t.lblSimWarnTxt;

    const btnSimExport = document.getElementById('btn-sim-export');
    if (btnSimExport) {
        btnSimExport.innerHTML = t.msgExportResults;
    }

    // ==========================================
    // Atualização Dinâmica do Simulador na Troca de Idioma
    // ==========================================
    const cbSimClass = document.getElementById('sim-cb-class');
    
    // Verifica se a tela do Simulador já foi montada alguma vez
    if (cbSimClass && typeof simChangeClass === "function") {
        
        // 1. Repopula os Dropdowns de Arma e Munição (Isso força o Lv/Nv a atualizar)
        const currentSimClass = cbSimClass.value;
        if (currentSimClass) simChangeClass(currentSimClass, true);

        // 2. Repopula o Dropdown de Armadura (Isso força o Lv/Nv do colete a atualizar)
        const cbArmorType = document.getElementById('sim-cb-armor-type');
        const cbArmor = document.getElementById('sim-cb-armor');
        
        if (cbArmorType && cbArmor && cbArmorType.value) {
            simArmorTypeSelected(cbArmorType.value, cbArmor.value);
        }

        // 3. Recalcula o painel APENAS se a placa final de danos estiver ativada na tela
        if (simResContainer && simResContainer.style.display === 'flex') {
            simRunCombatCalculation();
        }
    }

    // =========================================================================
    // TRADUÇÕES DOS ARTIGOS, CHANGELOG E SOBRE
    // =========================================================================
    if (document.getElementById('nav-articles')) document.getElementById('nav-articles').textContent = t.navArticles;
    if (document.getElementById('nav-about')) document.getElementById('nav-about').textContent = t.navAbout;
    
    if (document.getElementById('nav-changelog') && document.getElementById('lbl-nav-changelog-title')) {
        document.getElementById('lbl-nav-changelog-title').textContent = t.navChangelog;
    }
    
    if (document.getElementById('title-articles')) document.getElementById('title-articles').textContent = t.titleArticles;
    if (document.getElementById('lbl-articles-menu')) document.getElementById('lbl-articles-menu').textContent = t.lblArticlesMenu;
    if (document.getElementById('btn-articles-back')) document.getElementById('btn-articles-back').textContent = t.btnArticlesBack;
    
    const artContent = document.getElementById('article-content-area');
    if (artContent && artContent.innerHTML.includes('id="lbl-articles-placeholder"')) {
        document.getElementById('lbl-articles-placeholder').textContent = t.lblArticlesPlaceholder;
    }

    if (document.getElementById('title-about')) document.getElementById('title-about').textContent = t.titleAbout;
    const aboutContent = document.getElementById('about-content-area');
    if (aboutContent && (aboutContent.innerHTML.includes('Carregando') || aboutContent.innerHTML.includes('Loading'))) {
        aboutContent.innerHTML = `<div style="color: var(--text-dim); text-align: center; margin-top: 100px;">${t.lblAboutLoading}</div>`;
    }
    
    if (document.getElementById('title-changelog')) document.getElementById('title-changelog').textContent = t.titleChangelog;
    const clContent = document.getElementById('changelog-content-area');
    if (clContent && (clContent.innerHTML.includes('Carregando') || clContent.innerHTML.includes('Loading'))) {
        clContent.innerHTML = `<div style="color: var(--text-dim); text-align: center; margin-top: 100px;">${t.lblChangelogLoading}</div>`;
    }
    
    const lblDate = document.getElementById('nav-changelog-date');
    if (lblDate && (lblDate.textContent.includes('Lendo') || lblDate.textContent.includes('Reading'))) {
        lblDate.textContent = t.navChangelogReading;
    }
    
    if (typeof loadChangelog === "function") loadChangelog();
    if (typeof loadAboutContent === "function") loadAboutContent();
    
    if (typeof renderArticlesMenu === "function") {
        renderArticlesMenu();
        if (typeof currentArticleId !== "undefined" && currentArticleId !== null && typeof articlesIndex !== "undefined") {
            const activeArticle = articlesIndex.find(a => a.id === currentArticleId);
            if (activeArticle && typeof loadArticleContent === "function") {
                loadArticleContent(activeArticle.file);
            }
        }
    }
    
    if (currentSearchMode !== "") openSearchGrid(currentSearchMode);
    
    if (typeof updateCompEngine === "function" && typeof isCompInitialized !== "undefined" && isCompInitialized) {
        updateCompEngine();
        updateCompCartUI();
        const compResultsView = document.getElementById('compare-results-view');
        if (compResultsView && !compResultsView.classList.contains('hidden-section')) {
            generateComparisonTable();
        }
    }
    
    if (typeof dmgUpdateChartEngine === "function" && typeof isDmgInitialized !== "undefined" && isDmgInitialized) {
        initDamageChart(true); 
        dmgUpdateChartEngine(false); 
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'pt' ? 'en' : 'pt';
    applyLanguage(currentLang);
}

function showSection(sectionId) {
    // Esconde todas as seções principais
    document.getElementById('search-section').classList.add('hidden-section');
    document.getElementById('compare-section').classList.add('hidden-section');
    document.getElementById('damage-section').classList.add('hidden-section');
    if (document.getElementById('mask-comp-section')) document.getElementById('mask-comp-section').classList.add('hidden-section');
    
    // --- NOVO: Esconde o Simulador ---
    if (document.getElementById('simulator-section')) document.getElementById('simulator-section').classList.add('hidden-section');
    
    // Esconde as telas de Leitura
    if (document.getElementById('articles-section')) document.getElementById('articles-section').classList.add('hidden-section');
    if (document.getElementById('changelog-section')) document.getElementById('changelog-section').classList.add('hidden-section');
    if (document.getElementById('about-section')) document.getElementById('about-section').classList.add('hidden-section');
    
    // Remove o estado "ativo" (laranja) de todos os botões do menu lateral
    document.getElementById('nav-search').classList.remove('active');
    document.getElementById('nav-compare').classList.remove('active');
    if (document.getElementById('nav-damage')) document.getElementById('nav-damage').classList.remove('active');
    if (document.getElementById('nav-mask-comp')) document.getElementById('nav-mask-comp').classList.remove('active');
    
    // --- NOVO: Remove a cor do botão Simulador ---
    if (document.getElementById('nav-simulator')) document.getElementById('nav-simulator').classList.remove('active');
    
    if (document.getElementById('nav-articles')) document.getElementById('nav-articles').classList.remove('active');
    if (document.getElementById('nav-changelog')) document.getElementById('nav-changelog').classList.remove('active');
    if (document.getElementById('nav-about')) document.getElementById('nav-about').classList.remove('active');
    
    // Mostra a seção solicitada acendendo ela
    document.getElementById(sectionId).classList.remove('hidden-section');
    
    // Liga o botão correspondente e engatilha o motor interno (JavaScript) da tela
    if (sectionId === 'search-section') {
        document.getElementById('nav-search').classList.add('active');
        
    } else if (sectionId === 'compare-section') {
        document.getElementById('nav-compare').classList.add('active');
        if (typeof initCompareShowcase === "function") {
            initCompareShowcase();
        }
        
    } else if (sectionId === 'damage-section') {
        if (document.getElementById('nav-damage')) document.getElementById('nav-damage').classList.add('active');
        if (typeof initDamageChart === "function") initDamageChart();
        if (typeof dmgUpdateChartEngine === "function") dmgUpdateChartEngine(true);
        
    } else if (sectionId === 'mask-comp-section') { 
        if (document.getElementById('nav-mask-comp')) document.getElementById('nav-mask-comp').classList.add('active');
        if (typeof renderMaskCompatibilityUI === "function") renderMaskCompatibilityUI();
        
    // --- NOVO: Inicializador do Simulador ---
    } else if (sectionId === 'simulator-section') {
        if (document.getElementById('nav-simulator')) document.getElementById('nav-simulator').classList.add('active');
        if (typeof initCombatSimulator === "function") initCombatSimulator();
        
    } else if (sectionId === 'articles-section') {
        if (document.getElementById('nav-articles')) document.getElementById('nav-articles').classList.add('active');
        if (typeof initArticlesEngine === "function") initArticlesEngine();
        
    } else if (sectionId === 'changelog-section') {
        if (document.getElementById('nav-changelog')) document.getElementById('nav-changelog').classList.add('active');
        if (typeof loadChangelog === "function") loadChangelog();
        
    } else if (sectionId === 'about-section') {
        if (document.getElementById('nav-about')) document.getElementById('nav-about').classList.add('active');
        if (typeof loadAboutContent === "function") loadAboutContent();
    }
}


// =====================================================================
// 5. MOTOR DE FORMATAÇÃO E TRADUÇÃO DE DADOS 
// =====================================================================
function getViewConfig(mode) {
    const t = translations[currentLang];
    
    switch (mode) {
        case 'weapons':
            return {
                criteria: t.views.weapons.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.weapons.cols.name, tooltip: t.views.weapons.cols.nameTip },
                    { key: "Classe", label: t.views.weapons.cols.cls, tooltip: t.views.weapons.cols.clsTip },
                    { key: "Calibre", label: t.views.weapons.cols.cal, tooltip: t.views.weapons.cols.calTip },
                    { key: "RecuoVertical", label: t.views.weapons.cols.vrc, tooltip: t.views.weapons.cols.vrcTip },
                    { key: "RecuoHorizontal", label: t.views.weapons.cols.hrc, tooltip: t.views.weapons.cols.hrcTip },
                    { key: "Ergonomia", label: t.views.weapons.cols.ergo, tooltip: t.views.weapons.cols.ergoTip },
                    { key: "EstabilidadeArma", label: t.views.weapons.cols.ads, tooltip: t.views.weapons.cols.adsTip },
                    { key: "Precisao", label: t.views.weapons.cols.acc, tooltip: t.views.weapons.cols.accTip },
                    { key: "EstabilidadeHipFire", label: t.views.weapons.cols.hip, tooltip: t.views.weapons.cols.hipTip },
                    { key: "Alcance", label: t.views.weapons.cols.range, tooltip: t.views.weapons.cols.rangeTip },
                    { key: "VelocidadeBocal", label: t.views.weapons.cols.muz, tooltip: t.views.weapons.cols.muzTip },
                    { key: "ModoDisparo", label: t.views.weapons.cols.fire, tooltip: t.views.weapons.cols.fireTip },
                    { key: "Cadencia", label: t.views.weapons.cols.rof, tooltip: t.views.weapons.cols.rofTip },
                    { key: "PoderFogo", label: t.views.weapons.cols.power, tooltip: t.views.weapons.cols.powerTip },
                    { key: "TipoCano", label: t.views.weapons.cols.barrel, tooltip: t.views.weapons.cols.barrelTip }
                ]
            };

        case 'ammo':
            return {
                criteria: t.views.ammo.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.ammo.cols.name, tooltip: t.views.ammo.cols.nameTip },
                    { key: "NivelPenetracao", label: t.views.ammo.cols.lv, tooltip: t.views.ammo.cols.lvTip },
                    { key: "Penetracao", label: t.views.ammo.cols.pen, tooltip: t.views.ammo.cols.penTip },
                    { key: "DanoBase", label: t.views.ammo.cols.dmg, tooltip: t.views.ammo.cols.dmgTip },
                    { key: "DanoBlindagem", label: t.views.ammo.cols.armDmg, tooltip: t.views.ammo.cols.armDmgTip },
                    { key: "FerimentoContuso", label: t.views.ammo.cols.blunt, tooltip: t.views.ammo.cols.bluntTip },
                    { key: "Velocidade", label: t.views.ammo.cols.vel, tooltip: t.views.ammo.cols.velTip },
                    { key: "Precisao", label: t.views.ammo.cols.acc, tooltip: t.views.ammo.cols.accTip },
                    { key: "RecuoVertical", label: t.views.ammo.cols.vrc, tooltip: t.views.ammo.cols.vrcTip },
                    { key: "RecuoHorizontal", label: t.views.ammo.cols.hrc, tooltip: t.views.ammo.cols.hrcTip },
                    { key: "ChanceFerir", label: t.views.ammo.cols.wound, tooltip: t.views.ammo.cols.woundTip },
                    { key: "Calibre", label: t.views.ammo.cols.cal, tooltip: t.views.ammo.cols.calTip }
                ]
            };

        case 'grenades':
            return {
                criteria: t.views.grenades.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.grenades.cols.name, tooltip: t.views.grenades.cols.nameTip },
                    { key: "DelayExplosao", label: t.views.grenades.cols.delay, tooltip: t.views.grenades.cols.delayTip },
                    { key: "Alcance", label: t.views.grenades.cols.range, tooltip: t.views.grenades.cols.rangeTip },
                    { key: "DanoBlindagem", label: t.views.grenades.cols.armDmg, tooltip: t.views.grenades.cols.armDmgTip },
                    { key: "Penetracao", label: t.views.grenades.cols.pen, tooltip: t.views.grenades.cols.penTip },
                    { key: "Fragmentos", label: t.views.grenades.cols.frags, tooltip: t.views.grenades.cols.fragsTip },
                    { key: "TipoFragmento", label: t.views.grenades.cols.fragType, tooltip: t.views.grenades.cols.fragTypeTip },
                    { key: "TempoEfeito", label: t.views.grenades.cols.time, isTime: true, tooltip: t.views.grenades.cols.timeTip }
                ]
            };

        case 'helmets':
            return {
                defaultSort: { column: 'ClMaxMasc', direction: 'desc' }, 
                criteria: t.views.helmets.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.helmets.cols.name, tooltip: t.views.helmets.cols.nameTip },
                    { key: "Peso", label: t.views.helmets.cols.weight, tooltip: t.views.helmets.cols.weightTip },
                    { key: "Durabilidade", label: t.views.helmets.cols.dur, tooltip: t.views.helmets.cols.durTip },
                    { key: "ClasseBlindagem", label: t.views.helmets.cols.cls, tooltip: t.views.helmets.cols.clsTip },
                    { key: "Material", label: t.views.helmets.cols.mat, tooltip: t.views.helmets.cols.matTip },
                    { key: "BloqueioSom", label: t.views.helmets.cols.block, tooltip: t.views.helmets.cols.blockTip },
                    { key: "PenalidadeMovimento", label: t.views.helmets.cols.mov, tooltip: t.views.helmets.cols.movTip },
                    { key: "Ergonomia", label: t.views.helmets.cols.ergo, tooltip: t.views.helmets.cols.ergoTip },
                    { key: "AreaProtegida", label: t.views.helmets.cols.area, tooltip: t.views.helmets.cols.areaTip },
                    // COLUNA DESATIVADA TEMPORARIAMENTE (SEASON 7)
                    // { key: "Ricochete", label: t.views.helmets.cols.rico, tooltip: t.views.helmets.cols.ricoTip },
                    { key: "CaptacaoSom", label: t.views.helmets.cols.pickup, tooltip: t.views.helmets.cols.pickupTip },
                    { key: "ReducaoRuido", label: t.views.helmets.cols.noise, tooltip: t.views.helmets.cols.noiseTip },
                    { key: "Acessorio", label: t.views.helmets.cols.acc, tooltip: t.views.helmets.cols.accTip },
                    { key: "ClMaxMasc", label: t.views.helmets.cols.maxMask, tooltip: t.views.helmets.cols.maxMaskTip } 
                ]
            };

        case 'masks':
            return {
                criteria: t.views.masks.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.masks.cols.name, tooltip: t.views.masks.cols.nameTip },
                    { key: "Peso", label: t.views.masks.cols.weight, tooltip: t.views.masks.cols.weightTip },
                    { key: "Durabilidade", label: t.views.masks.cols.dur, tooltip: t.views.masks.cols.durTip },
                    { key: "ClasseBlindagem", label: t.views.masks.cols.cls, tooltip: t.views.masks.cols.clsTip },
                    { key: "Material", label: t.views.masks.cols.mat, tooltip: t.views.masks.cols.matTip }
                    // COLUNA DESATIVADA TEMPORARIAMENTE (SEASON 7)
                    // ,{ key: "Ricochete", label: t.views.masks.cols.rico, tooltip: t.views.masks.cols.ricoTip }
                ]
            };

        case 'gasMasks':
            return {
                criteria: t.views.gasMasks.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.gasMasks.cols.name, tooltip: t.views.gasMasks.cols.nameTip },
                    { key: "Peso", label: t.views.gasMasks.cols.weight, tooltip: t.views.gasMasks.cols.weightTip },
                    { key: "Durabilidade", label: t.views.gasMasks.cols.dur, tooltip: t.views.gasMasks.cols.durTip },
                    { key: "AntiVeneno", label: t.views.gasMasks.cols.poison, tooltip: t.views.gasMasks.cols.poisonTip },
                    { key: "AntiFlash", label: t.views.gasMasks.cols.flash, tooltip: t.views.gasMasks.cols.flashTip }
                ]
            };

        case 'headsets':
            return {
                criteria: t.views.headsets.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.headsets.cols.name, tooltip: t.views.headsets.cols.nameTip },
                    { key: "Peso", label: t.views.headsets.cols.weight, tooltip: t.views.headsets.cols.weightTip },
                    { key: "CaptacaoSom", label: t.views.headsets.cols.pickup, tooltip: t.views.headsets.cols.pickupTip },
                    { key: "ReducaoRuido", label: t.views.headsets.cols.noise, tooltip: t.views.headsets.cols.noiseTip }
                ]
            };

        case 'bodyArmor':
            return {
                criteria: t.views.bodyArmor.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.bodyArmor.cols.name, tooltip: t.views.bodyArmor.cols.nameTip },
                    { key: "Peso", label: t.views.bodyArmor.cols.weight, tooltip: t.views.bodyArmor.cols.weightTip },
                    { key: "ClasseBlindagem", label: t.views.bodyArmor.cols.cls, tooltip: t.views.bodyArmor.cols.clsTip },
                    { key: "Durabilidade", label: t.views.bodyArmor.cols.dur, tooltip: t.views.bodyArmor.cols.durTip },
                    { key: "Material", label: t.views.bodyArmor.cols.mat, tooltip: t.views.bodyArmor.cols.matTip },
                    { key: "PenalidadeMovimento", label: t.views.bodyArmor.cols.mov, tooltip: t.views.bodyArmor.cols.movTip },
                    { key: "Ergonomia", label: t.views.bodyArmor.cols.ergo, tooltip: t.views.bodyArmor.cols.ergoTip },
                    { key: "AreaProtegida", label: t.views.bodyArmor.cols.area, tooltip: t.views.bodyArmor.cols.areaTip }
                ]
            };

        case 'armoredRigs':
            return {
                criteria: t.views.armoredRigs.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.armoredRigs.cols.name, tooltip: t.views.armoredRigs.cols.nameTip },
                    { key: "Peso", label: t.views.armoredRigs.cols.weight, tooltip: t.views.armoredRigs.cols.weightTip },
                    { key: "ClasseBlindagem", label: t.views.armoredRigs.cols.cls, tooltip: t.views.armoredRigs.cols.clsTip },
                    { key: "Durabilidade", label: t.views.armoredRigs.cols.dur, tooltip: t.views.armoredRigs.cols.durTip },
                    { key: "Material", label: t.views.armoredRigs.cols.mat, tooltip: t.views.armoredRigs.cols.matTip },
                    { key: "PenalidadeMovimento", label: t.views.armoredRigs.cols.mov, tooltip: t.views.armoredRigs.cols.movTip },
                    { key: "Ergonomia", label: t.views.armoredRigs.cols.ergo, tooltip: t.views.armoredRigs.cols.ergoTip },
                    { key: "EspacoArmazenamento", label: t.views.armoredRigs.cols.space, tooltip: t.views.armoredRigs.cols.spaceTip },
                    { key: "AreaProtegida", label: t.views.armoredRigs.cols.area, tooltip: t.views.armoredRigs.cols.areaTip },
                    { key: "LayoutInterno", label: t.views.armoredRigs.cols.layout, tooltip: t.views.armoredRigs.cols.layoutTip }
                ]
            };

        case 'unarmoredRigs':
            return {
                criteria: t.views.unarmoredRigs.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.unarmoredRigs.cols.name, tooltip: t.views.unarmoredRigs.cols.nameTip },
                    { key: "Peso", label: t.views.unarmoredRigs.cols.weight, tooltip: t.views.unarmoredRigs.cols.weightTip },
                    { key: "EspacoTotal", label: t.views.unarmoredRigs.cols.space, tooltip: t.views.unarmoredRigs.cols.spaceTip },
                    { key: "TamanhoDesdobrada", label: t.views.unarmoredRigs.cols.unfold, tooltip: t.views.unarmoredRigs.cols.unfoldTip },
                    { key: "TamanhoDobrada", label: t.views.unarmoredRigs.cols.fold, tooltip: t.views.unarmoredRigs.cols.foldTip },
                    { key: "LayoutInterno", label: t.views.unarmoredRigs.cols.layout, tooltip: t.views.unarmoredRigs.cols.layoutTip },
                    { key: "EficienciaDisplay", label: t.views.unarmoredRigs.cols.eff, tooltip: t.views.unarmoredRigs.cols.effTip }
                ]
            };

        case 'backpacks':
            return {
                criteria: t.views.backpacks.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.backpacks.cols.name, tooltip: t.views.backpacks.cols.nameTip },
                    { key: "Peso", label: t.views.backpacks.cols.weight, tooltip: t.views.backpacks.cols.weightTip },
                    { key: "EspacoTotal", label: t.views.backpacks.cols.space, tooltip: t.views.backpacks.cols.spaceTip },
                    { key: "TamanhoDesdobrada", label: t.views.backpacks.cols.unfold, tooltip: t.views.backpacks.cols.unfoldTip },
                    { key: "TamanhoDobrada", label: t.views.backpacks.cols.fold, tooltip: t.views.backpacks.cols.foldTip },
                    { key: "LayoutInterno", label: t.views.backpacks.cols.layout, tooltip: t.views.backpacks.cols.layoutTip },
                    { key: "EficienciaDisplay", label: t.views.backpacks.cols.eff, tooltip: t.views.backpacks.cols.effTip }
                ]
            };

        case 'medical_painkillers': 
            return {
                criteria: t.views.painkillers.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.painkillers.cols.name, tooltip: t.views.painkillers.cols.nameTip },
                    { key: "Usos", label: t.views.painkillers.cols.uses, tooltip: t.views.painkillers.cols.usesTip },
                    { key: "Duracao", label: t.views.painkillers.cols.dur, isTime: true, tooltip: t.views.painkillers.cols.durTip },
                    { key: "Desidratacao", label: t.views.painkillers.cols.dehyd, tooltip: t.views.painkillers.cols.dehydTip },
                    { key: "Delay", label: t.views.painkillers.cols.delay, tooltip: t.views.painkillers.cols.delayTip },
                    { key: "DurMax", label: t.views.painkillers.cols.maxDur, isTime: true, tooltip: t.views.painkillers.cols.maxDurTip },
                    { key: "DesMax", label: t.views.painkillers.cols.maxDehyd, tooltip: t.views.painkillers.cols.maxDehydTip }
                ]
            };

        case 'medical_bandages': 
            return {
                criteria: t.views.bandages.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.bandages.cols.name, tooltip: t.views.bandages.cols.nameTip },
                    { key: "Usos", label: t.views.bandages.cols.uses, tooltip: t.views.bandages.cols.usesTip },
                    { key: "Delay", label: t.views.bandages.cols.delay, tooltip: t.views.bandages.cols.delayTip },
                    { key: "CustoDurabilidade", label: t.views.bandages.cols.cost, tooltip: t.views.bandages.cols.costTip }
                ]
            };

        case 'medical_surgical': 
            return {
                criteria: t.views.surgical.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.surgical.cols.name, tooltip: t.views.surgical.cols.nameTip },
                    { key: "Usos", label: t.views.surgical.cols.uses, tooltip: t.views.surgical.cols.usesTip },
                    { key: "Delay", label: t.views.surgical.cols.delay, tooltip: t.views.surgical.cols.delayTip },
                    { key: "Desidratacao", label: t.views.surgical.cols.dehyd, tooltip: t.views.surgical.cols.dehydTip },
                    { key: "RecuperacaoHP", label: t.views.surgical.cols.hp, tooltip: t.views.surgical.cols.hpTip },
                    { key: "CustoDurabilidade", label: t.views.surgical.cols.cost, tooltip: t.views.surgical.cols.costTip },
                    { key: "EspacoOcupado", label: t.views.surgical.cols.space, tooltip: t.views.surgical.cols.spaceTip }
                ]
            };

        case 'medical_nebulizers': 
            return {
                criteria: t.views.nebulizers.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.nebulizers.cols.name, tooltip: t.views.nebulizers.cols.nameTip },
                    { key: "Usos", label: t.views.nebulizers.cols.uses, tooltip: t.views.nebulizers.cols.usesTip },
                    { key: "Delay", label: t.views.nebulizers.cols.delay, tooltip: t.views.nebulizers.cols.delayTip },
                    { key: "CustoDurabilidade", label: t.views.nebulizers.cols.cost, tooltip: t.views.nebulizers.cols.costTip }
                ]
            };

        case 'medical_medkits': 
            return {
                criteria: t.views.medkits.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.medkits.cols.name, tooltip: t.views.medkits.cols.nameTip },
                    { key: "DurabilidadeTotal", label: t.views.medkits.cols.dur, tooltip: t.views.medkits.cols.durTip },
                    { key: "Desidratacao", label: t.views.medkits.cols.dehyd, tooltip: t.views.medkits.cols.dehydTip },
                    { key: "VelocidadeCura", label: t.views.medkits.cols.speed, tooltip: t.views.medkits.cols.speedTip },
                    { key: "Delay", label: t.views.medkits.cols.delay, tooltip: t.views.medkits.cols.delayTip },
                    { key: "CustoPorUso", label: t.views.medkits.cols.cost, tooltip: t.views.medkits.cols.costTip },
                    { key: "EspacoOcupado", label: t.views.medkits.cols.space, tooltip: t.views.medkits.cols.spaceTip },
                    { key: "DurabSlot", label: t.views.medkits.cols.eff, tooltip: t.views.medkits.cols.effTip }
                ]
            };

        case 'medical_stimulants': 
            return {
                criteria: t.views.stimulants.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.stimulants.cols.name, tooltip: t.views.stimulants.cols.nameTip },
                    { key: "EfeitoPrincipal", label: t.views.stimulants.cols.effect, tooltip: t.views.stimulants.cols.effectTip },
                    { key: "Duracao", label: t.views.stimulants.cols.dur, isTime: true, tooltip: t.views.stimulants.cols.durTip },
                    { key: "Desidratacao", label: t.views.stimulants.cols.dehyd, tooltip: t.views.stimulants.cols.dehydTip },
                    { key: "ReducaoEnergia", label: t.views.stimulants.cols.energy, tooltip: t.views.stimulants.cols.energyTip },
                    { key: "Delay", label: t.views.stimulants.cols.delay, tooltip: t.views.stimulants.cols.delayTip }
                ]
            };

        case 'food_all':
        case 'food_items':
        case 'food_beverages':
            return {
                criteria: t.views.food.criteria,
                columns: [
                    { key: "NomeItem", label: t.views.food.cols.name, tooltip: t.views.food.cols.nameTip },
                    { key: "Hidratacao", label: t.views.food.cols.hyd, tooltip: t.views.food.cols.hydTip },
                    { key: "Energia", label: t.views.food.cols.eng, tooltip: t.views.food.cols.engTip },
                    { key: "RecuperacaoStamina", label: t.views.food.cols.stam, tooltip: t.views.food.cols.stamTip },
                    { key: "EspacoOcupado", label: t.views.food.cols.space, tooltip: t.views.food.cols.spaceTip },
                    { key: "HidratSlot", label: t.views.food.cols.hydSlot, tooltip: t.views.food.cols.hydSlotTip },
                    { key: "EnergSlot", label: t.views.food.cols.engSlot, tooltip: t.views.food.cols.engSlotTip },
                    { key: "Delay", label: t.views.food.cols.delay, tooltip: t.views.food.cols.delayTip }
                ]
            };

        default: 
            return null;
    }
}


// =====================================================================
// 6. RENDERIZAÇÃO DA TABELA (DATAGRIDVIEW WEB)
// =====================================================================
let currentSearchMode = "";
let currentSortColumn = "";
let currentSortDirection = "asc"; // "asc" para crescente, "desc" para decrescente

function changeMedicalSubcategory(subCategoryCode) {
    currentSearchMode = subCategoryCode;
    const config = getViewConfig(currentSearchMode);
    
    if (config && config.defaultSort) {
        currentSortColumn = config.defaultSort.column;
        currentSortDirection = config.defaultSort.direction;
    } else {
        currentSortColumn = "";
        currentSortDirection = "asc";
    }
    
    const criteriaSelect = document.getElementById('criteria-select');
    if (config) {
        criteriaSelect.innerHTML = '';
        config.criteria.forEach(crit => {
            const opt = document.createElement('option');
            opt.value = crit;
            opt.textContent = crit;
            criteriaSelect.appendChild(opt);
        });
    }
    renderDataTable();
}

function changeFoodSubcategory(subCategoryCode) {
    currentSearchMode = subCategoryCode;
    const config = getViewConfig(currentSearchMode);
    
    if (config && config.defaultSort) {
        currentSortColumn = config.defaultSort.column;
        currentSortDirection = config.defaultSort.direction;
    } else {
        currentSortColumn = "";
        currentSortDirection = "asc";
    }
    
    const criteriaSelect = document.getElementById('criteria-select');
    if (config) {
        criteriaSelect.innerHTML = '';
        config.criteria.forEach(crit => {
            const opt = document.createElement('option');
            opt.value = crit;
            opt.textContent = crit;
            criteriaSelect.appendChild(opt);
        });
    }
    renderDataTable();
}

function openSearchGrid(mode) {
    const t = translations[currentLang];
    const medicalContainer = document.getElementById('medical-subcategory-container');
    const foodContainer = document.getElementById('food-subcategory-container');
    const ammoContainer = document.getElementById('ammo-specific-controls'); 
    const titleElement = document.getElementById('current-category-title');

    // Desliga todos os painéis extras por padrão
    if (medicalContainer) medicalContainer.style.display = 'none';
    if (foodContainer) foodContainer.style.display = 'none';
    if (ammoContainer) ammoContainer.style.display = 'none';

    if (mode === 'medical' || mode.startsWith('medical_')) {
        if (medicalContainer) medicalContainer.style.display = 'flex'; 
        titleElement.textContent = t.titlePharmSearch;
        
        if (mode === 'medical') {
            const selectBox = document.getElementById('medical-subcategory-select');
            if (selectBox) selectBox.value = 'medical_painkillers';
            currentSearchMode = 'medical_painkillers';
        } else {
            currentSearchMode = mode;
        }
    } 
    else if (mode === 'food' || mode.startsWith('food_')) {
        if (foodContainer) foodContainer.style.display = 'flex'; 
        titleElement.textContent = t.titleFoodSearch;
        
        if (mode === 'food') {
            const selectBox = document.getElementById('food-subcategory-select');
            if (selectBox) selectBox.value = 'food_all';
            currentSearchMode = 'food_all';
        } else {
            currentSearchMode = mode;
        }
    } 
    else if (mode === 'ammo') {
        // Acende o painel de munições e prepara a lista de Categorias
        if (ammoContainer) ammoContainer.style.display = 'flex';
        currentSearchMode = mode;
        titleElement.textContent = t.titlesCategory[mode] || t.fallbackSearch;

        const cbAmmoCat = document.getElementById('cbAmmoCat');
        const cbAmmoWep = document.getElementById('cbAmmoWep');

        if (cbAmmoCat && db.weapons && db.weapons.length > 0) {
            
            // --- LEITURA DINÂMICA DA MAIOR ARMA PARA TRAVAR O TAMANHO DO SELECT ---
            if (cbAmmoWep && !cbAmmoWep.style.width) {
                let maxChars = 0;
                db.weapons.forEach(w => {
                    if (w.NomeItem && w.NomeItem.length > maxChars) {
                        maxChars = w.NomeItem.length;
                    }
                });
                cbAmmoWep.style.width = (maxChars + 6) + 'ch';
            }
            // ----------------------------------------------------------------------

            // Removemos a trava para forçar a reconstrução no idioma atualizado
            cbAmmoCat.innerHTML = `<option value="Todas">${t.optAmmoAll}</option>`;
            let uniqueCats = new Set();
            
            db.weapons.forEach(w => {
                let catName = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', w.Classe) : w.Classe;
                if (catName) uniqueCats.add(catName);
            });

            Array.from(uniqueCats).sort().forEach(cat => {
                let opt = document.createElement('option');
                opt.value = cat; 
                opt.textContent = cat;
                cbAmmoCat.appendChild(opt);
            });
            
            cbAmmoCat.value = "Todas"; // Reseta visualmente sempre que abre a tela
            changeAmmoCategory("Todas", false); // Popula o menu de armas com "Todas" inicialmente
        }
    }
    else {
        currentSearchMode = mode;
        titleElement.textContent = t.titlesCategory[mode] || t.fallbackSearch;
    }

    const config = getViewConfig(currentSearchMode);
    
    if (config && config.defaultSort) {
        currentSortColumn = config.defaultSort.column;
        currentSortDirection = config.defaultSort.direction;
    } else {
        currentSortColumn = ""; 
        currentSortDirection = "asc";
    }
    
    document.getElementById('search-menu-view').classList.add('hidden-section');
    document.getElementById('search-data-view').classList.remove('hidden-section');

    // LÓGICA PARA OCULTAR/MOSTRAR O BOTÃO DE FILTRO
    const filterBtn = document.getElementById('btn-filter');
    if (filterBtn) {
        const categoriesWithoutFilter = [
            'grenades', 'masks', 'gasMasks', 'headsets', 
            'unarmoredRigs', 'backpacks'
        ];

        if (categoriesWithoutFilter.includes(currentSearchMode) || 
            currentSearchMode.startsWith('medical_') || 
            currentSearchMode.startsWith('food_')) {
            filterBtn.style.display = 'none';
        } else {
            filterBtn.style.display = ''; 
        }
    }
    
    const criteriaSelect = document.getElementById('criteria-select');
    
    if (config) {
        criteriaSelect.innerHTML = ''; 
        config.criteria.forEach(crit => {
            const opt = document.createElement('option');
            opt.value = crit;
            opt.textContent = crit;
            criteriaSelect.appendChild(opt);
        });
        criteriaSelect.disabled = false;
    }

    const orderSelect = document.getElementById('order-select');
    criteriaSelect.onchange = null;
    orderSelect.onchange = null;

    criteriaSelect.onchange = () => renderDataTable();
    orderSelect.onchange = () => renderDataTable();

    renderDataTable();
}

function closeSearchGrid() {
    currentSearchMode = "";
    
    const medicalContainer = document.getElementById('medical-subcategory-container');
    const foodContainer = document.getElementById('food-subcategory-container');
    
    if (medicalContainer) medicalContainer.style.display = 'none';
    if (foodContainer) foodContainer.style.display = 'none';

    document.getElementById('search-data-view').classList.add('hidden-section');
    document.getElementById('search-menu-view').classList.remove('hidden-section');
    
    document.getElementById('table-head').innerHTML = '';
    document.getElementById('table-body').innerHTML = '';
}

// =====================================================================
// FILTRO REVERSO DE MUNIÇÕES (ARMA / CATEGORIA) E TRAVAS DE SEGURANÇA
// =====================================================================
let ammoActiveCategory = "Todas";
let ammoActiveWeapon = "Todas";

function changeAmmoCategory(selectedCategory, shouldRender = true) {
    ammoActiveCategory = selectedCategory;
    ammoActiveWeapon = "Todas"; // Ao mudar categoria, sempre reseta a arma
    
    const t = translations[currentLang];
    const cbAmmoWep = document.getElementById('cbAmmoWep');
    
    if (cbAmmoWep && db.weapons) {
        cbAmmoWep.innerHTML = `<option value="Todas">${t.optAmmoAll}</option>`;
        
        // Filtra as armas que pertencem à categoria selecionada (ou pega todas se for "Todas")
        let filteredWeps = db.weapons.filter(w => {
            if (ammoActiveCategory === "Todas") return true;
            let catName = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', w.Classe) : w.Classe;
            return catName === ammoActiveCategory;
        });

        // Ordena por nome e adiciona ao dropdown
        filteredWeps.sort((a, b) => a.NomeItem.localeCompare(b.NomeItem)).forEach(w => {
            let opt = document.createElement('option');
            opt.value = w.NomeItem;
            opt.textContent = w.NomeItem;
            cbAmmoWep.appendChild(opt);
        });
        
        cbAmmoWep.value = "Todas";
    }

    // LÓGICA DE TRAVAS DE SEGURANÇA
    const btnFilter = document.getElementById('btn-filter');
    if (ammoActiveCategory !== "Todas") {
        // Trava o botão de filtros se o usuário selecionar uma Categoria
        if (btnFilter) btnFilter.classList.add('ui-locked-btn');
    } else {
        // Destrava se voltar para Todas
        if (btnFilter && !globalFilters['ammo']) btnFilter.classList.remove('ui-locked-btn');
    }

    if (shouldRender) renderDataTable();
}

function changeAmmoWeapon(selectedWeapon) {
    ammoActiveWeapon = selectedWeapon;
    
    // LÓGICA DE TRAVAS DE SEGURANÇA (Foco Absoluto)
    const btnFilter = document.getElementById('btn-filter');
    const cbAmmoCat = document.getElementById('cbAmmoCat');
    
    if (ammoActiveWeapon !== "Todas") {
        // Se escolheu uma arma, trava o botão Filtro e o menu de Categorias
        if (btnFilter) btnFilter.classList.add('ui-locked-btn');
        if (cbAmmoCat) cbAmmoCat.classList.add('ui-locked');
    } else {
        // Se voltou para "Todas", destrava a Categoria. O Filtro só destrava se a Categoria também for "Todas"
        if (cbAmmoCat) cbAmmoCat.classList.remove('ui-locked');
        if (btnFilter && ammoActiveCategory === "Todas" && !globalFilters['ammo']) btnFilter.classList.remove('ui-locked-btn');
    }

    renderDataTable();
}

function resetAmmoFilters() {
    ammoActiveCategory = "Todas";
    ammoActiveWeapon = "Todas";
    
    // Reseta visualmente as caixas
    const cbAmmoCat = document.getElementById('cbAmmoCat');
    if (cbAmmoCat) {
        cbAmmoCat.value = "Todas";
        cbAmmoCat.classList.remove('ui-locked');
    }
    
    // Limpa o menu de armas para mostrar todas
    changeAmmoCategory("Todas", false);
    
    // Limpa Filtros Manuais se houverem
    if (globalFilters['ammo']) {
        globalFilters['ammo'] = {};
    }
    updateFilterButtonVisual();
    
    // Destrava o botão "Filtros"
    const btnFilter = document.getElementById('btn-filter');
    if (btnFilter) btnFilter.classList.remove('ui-locked-btn');

    renderDataTable();
}

// =====================================================================
// MOTORES DE CÁLCULO E FORMATAÇÃO DE INTERFACE
// =====================================================================

function getCellTooltip(columnKey, cellValue) {
    const t = translations[currentLang];

    if (columnKey === 'TipoCano') {
        return t.tooltipBarrel[cellValue] || null; 
    }

    if (columnKey === 'ClMaxMasc') {
        if (typeof cellValue === 'string' && cellValue.includes('*')) {
            return t.tooltipFaceProtection;
        }
    }
    return null; 
}

function calculateArea(sizeStr) {
    if (!sizeStr || typeof sizeStr !== 'string') return 0;
    const parts = sizeStr.toLowerCase().split('x');
    if (parts.length === 2) {
        return (parseInt(parts[0]) || 0) * (parseInt(parts[1]) || 0);
    }
    return 0;
}

function formatTime(totalSecs) {
    const t = translations[currentLang];
    const strMin = t.lblMin || "min";
    const strSec = t.lblSec || "s";
    
    const secs = parseInt(totalSecs);
    if (isNaN(secs) || secs === 0) return totalSecs !== undefined ? totalSecs : "0";
    
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    
    if (mins > 0) {
        if (remSecs === 0) {
            return `${secs} (${mins}${strMin})`; 
        } else {
            return `${secs} (${mins}${strMin}/${remSecs}${strSec})`; 
        }
    }
    
    return `${secs}${strSec}`; 
}

function formatLayout(layoutStr) {
    if (!layoutStr || typeof layoutStr !== 'string' || layoutStr.trim() === "" || layoutStr.includes("/")) return layoutStr;
    const parts = layoutStr.split(',').map(s => s.trim());
    const counts = {};
    parts.forEach(p => { if (p) counts[p] = (counts[p] || 0) + 1; });
    
    const result = [];
    for (const [size, qty] of Object.entries(counts)) {
        result.push(`${size} (${qty}x)`);
    }
    return result.join(' | ');
}

function getHelmetMaskClass(helmetRow) {
    const areaProt = (helmetRow.AreaProtegida || "").toLowerCase();
    const acessorio = (helmetRow.Acessorio || "").toLowerCase(); 
    
    if (areaProt.includes("face") || areaProt.includes("rosto")) {
        return helmetRow.ClasseBlindagem + "*";
    }
    
    if (acessorio.includes("mask") || acessorio.includes("máscara") || acessorio.includes("mascara")) {
        if (!db.maskCompatibility || !db.masks) return "/////";
        
        let bestClass = 0;
        
        db.maskCompatibility.forEach(row => {
            const compHelmets = (row.CompatibleHelmets || "").toLowerCase();
            if (compHelmets.includes(helmetRow.NomeItem.toLowerCase()) || compHelmets.includes("all")) {
                const mask = db.masks.find(m => (m.NomeItem || "").toLowerCase() === (row.MaskName || "").toLowerCase());
                if (mask) {
                    const maskClass = parseInt(mask.ClasseBlindagem) || 0;
                    if (maskClass > bestClass) bestClass = maskClass;
                }
            }
        });
        
        return bestClass > 0 ? bestClass.toString() : "/////";
    }
    
    return "/////"; 
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA ARMAS ---
function compareWeaponsComplex(a, b, criterion, isDescending) {
    const dir = isDescending ? -1 : 1;

    // Função auxiliar para pegar o valor numérico ou o peso mapeado
    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;
        
        if (col === 'PoderFogo' || col === 'TipoCano' || col === 'ModoDisparo') {
            return sortWeights[col][val] || 0;
        }
        
        const num = parseFloat(val);
        return isNaN(num) ? val : num; // Se for string (ex: Nome), retorna string, senão numero
    };

    // Função auxiliar para comparar
    const comp = (colA, colB) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;

    switch (criterion) {
        case "Controle de Recuo Vertical":
        case "Vertical Recoil Control":
            result = comp(getValue(a, 'RecuoVertical'), getValue(b, 'RecuoVertical'));
            if (result === 0) result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Controle de Recuo Horizontal":
        case "Horizontal Recoil Control":
            result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            if (result === 0) result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'RecuoVertical'), getValue(b, 'RecuoVertical'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Ergonomia":
        case "Ergonomics":
            result = comp(getValue(a, 'Ergonomia'), getValue(b, 'Ergonomia'));
            if (result === 0) result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Estabilidade da Arma":
        case "Weapon Stability":
            result = comp(getValue(a, 'EstabilidadeArma'), getValue(b, 'EstabilidadeArma'));
            if (result === 0) result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Precisão":
        case "Accuracy":
            result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            break;

        case "Estabilidade sem Mirar": // Removido do menu visual, mas mantido por segurança
        case "Hip-fire stability":
            result = comp(getValue(a, 'EstabilidadeHipFire'), getValue(b, 'EstabilidadeHipFire'));
            if (result === 0) result = comp(getValue(a, 'Precisao'), getValue(b, 'Precisao'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Distância Efetiva": // Removido do menu visual, mas mantido por segurança
        case "Effective Range":
            result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'));
            if (result === 0) result = comp(getValue(a, 'VelocidadeBocal'), getValue(b, 'VelocidadeBocal'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            break;

        case "Velocidade de Saída":
        case "Muzzle Velocity":
            result = comp(getValue(a, 'VelocidadeBocal'), getValue(b, 'VelocidadeBocal'));
            if (result === 0) result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'));
            break;

        case "Modo de Disparo": // Removido do menu visual, mas mantido por segurança
        case "Fire Mode":
            result = comp(getValue(a, 'ModoDisparo'), getValue(b, 'ModoDisparo'));
            if (result === 0) result = comp(getValue(a, 'PoderFogo'), getValue(b, 'PoderFogo'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            if (result === 0) result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            break;

        case "Cadência":
        case "Rate of Fire":
            result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            if (result === 0) result = comp(getValue(a, 'PoderFogo'), getValue(b, 'PoderFogo'));
            break;

        case "Poder de Fogo":
        case "Firepower":
            result = comp(getValue(a, 'PoderFogo'), getValue(b, 'PoderFogo'));
            if (result === 0) result = comp(getValue(a, 'VelocidadeBocal'), getValue(b, 'VelocidadeBocal'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            break;

        case "Melhoria de Cano (Perfil da Arma)": 
        case "Barrel Upgrade (Weapon Profile)":
            result = comp(getValue(a, 'TipoCano'), getValue(b, 'TipoCano'));
            if (result === 0) result = comp(getValue(a, 'PoderFogo'), getValue(b, 'PoderFogo'));
            if (result === 0) result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'));
            if (result === 0) result = comp(getValue(a, 'Cadencia'), getValue(b, 'Cadencia'));
            if (result === 0) result = comp(getValue(a, 'RecuoHorizontal'), getValue(b, 'RecuoHorizontal'));
            break;

        case "Alfabético":
        case "Alphabetical":
        default:
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'));
            break;
    }

    return result;
}

function compareAmmoComplex(a, b, criterion, isDescending) {
    const dir = isDescending ? -1 : 1;

    // Função auxiliar avançada para Munição
    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;
        
        if (col === 'ChanceFerir') return sortWeights.ChanceFerir[val] || 0; // Usei o sortWeights correto aqui
        
        // Tratamento especial para o Dano Base das Shotguns (Ex: "36x8 (288)" -> 288)
        if (col === 'DanoBase' && typeof val === 'string') {
            const match = val.match(/\((\d+)\)/); // Busca o número entre parênteses
            if (match) return parseInt(match[1], 10);
            return parseInt(val.replace(/\D/g, ''), 10) || 0; // Limpa tudo que não for número
        }

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    // Compara obedecendo a ordem (Asc/Desc)
    const comp = (colA, colB) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    // Compara ignorando a ordem (Sempre do maior para o menor - usado nos desempates de Alfabético)
    const compDescAlways = (colA, colB) => {
        if (colA < colB) return 1;
        if (colA > colB) return -1;
        return 0;
    };

    let result = 0;

    switch (criterion) {
        case "Dano Base":
        case "Base Damage":
            result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            if (result === 0) result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'));
            break;

        case "Nível de Penetração":
        case "Penetration Level":
            result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            if (result === 0) result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'));
            break;

        case "Dano de Blindagem":
        case "Armor Damage":
            result = comp(getValue(a, 'DanoBlindagem'), getValue(b, 'DanoBlindagem'));
            if (result === 0) result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'));
            if (result === 0) result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            break;

        // =========================================================
        // SEU NOVO CRITÉRIO COM A CASCATA COMPLETA DE 6 DESEMPATES
        // =========================================================
        case "Ferimento Contuso":
        case "Blunt Trauma":
            result = comp(getValue(a, 'FerimentoContuso'), getValue(b, 'FerimentoContuso'));
            if (result === 0) result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            if (result === 0) result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'));
            if (result === 0) result = comp(getValue(a, 'DanoBlindagem'), getValue(b, 'DanoBlindagem'));
            if (result === 0) result = comp(getValue(a, 'ChanceFerir'), getValue(b, 'ChanceFerir'));
            if (result === 0) result = comp(getValue(a, 'Velocidade'), getValue(b, 'Velocidade'));
            break;

        case "Chance de Ferir":
        case "Wound Chance":
            result = comp(getValue(a, 'ChanceFerir'), getValue(b, 'ChanceFerir'));
            if (result === 0) result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            if (result === 0) result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            break;

        // Esses critérios abaixo compartilham o mesmo padrão de desempate
        case "Precisão": case "Accuracy":
        case "Penetração": case "Penetration":
        case "Velocidade Inicial": case "Muzzle Velocity":
        case "Controle de Recuo Vertical": case "Vertical Recoil Control":
        case "Controle de Recuo Horizontal": case "Horizontal Recoil Control":
            
            // Define o target baseado na string
            let targetCol = "";
            if (criterion.includes("Precis")) targetCol = 'Precisao';
            else if (criterion.includes("Penetr")) targetCol = 'Penetracao';
            else if (criterion.includes("Velocidade")) targetCol = 'Velocidade';
            else if (criterion.includes("Vertical")) targetCol = 'RecuoVertical';
            else targetCol = 'RecuoHorizontal';

            result = comp(getValue(a, targetCol), getValue(b, targetCol));
            if (result === 0) result = comp(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = comp(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            break;

        case "Alfabético":
        case "Alphabetical":
        default:
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'));
            // No Alfabético, o sistema força a ordem decrescente (do mais forte pro mais fraco) no desempate
            if (result === 0) result = compDescAlways(getValue(a, 'NivelPenetracao'), getValue(b, 'NivelPenetracao'));
            if (result === 0) result = compDescAlways(getValue(a, 'DanoBase'), getValue(b, 'DanoBase'));
            break;
    }

    return result;
}

function compareGrenadesComplex(a, b, criterion, isDescending) {
    const dirNormal = isDescending ? -1 : 1; 
    const dirInverso = isDescending ? 1 : -1; // Para Delay (Menor é Melhor)

    // Função para pegar Delay 1 ou Delay 2 (Ex: "3 - 4.5" -> d1=3, d2=4.5)
    const getDelay = (row, index) => {
        if (!row.DelayExplosao || row.DelayExplosao === "/////") return 0;
        const parts = row.DelayExplosao.split('-').map(s => parseFloat(s.trim()));
        if (index === 1 && parts.length > 0) return parts[0];
        if (index === 2 && parts.length > 1) return parts[1];
        return 0;
    };

    // Função para pegar os pesos das granadas
    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;
        
        if (col === 'Alcance') return sortWeights.AlcanceGrenade[val] || 0;
        if (col === 'DanoBlindagem') return sortWeights.DanoBlindGrenade[val] || 0;
        if (col === 'Penetracao') return sortWeights.PenetracaoGrenade[val] || 0;
        if (col === 'Fragmentos') return sortWeights.FragmentosGrenade[val] || 0;
        if (col === 'TipoFragmento') return sortWeights.TipoFragsGrenade[val] || 0;
        if (col === 'TempoEfeito') return parseFloat(val) || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;

    switch (criterion) {
        case "Alfabético": case "Alphabetical":
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), dirNormal);
            break;
        case "Delay de Explosão": case "Explosion Delay":
            result = comp(getDelay(a, 1), getDelay(b, 1), dirInverso); // Inverso!
            break;
        case "Alcance": case "Range":
            result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'), dirNormal);
            break;
        case "Dano de Blindagem": case "Dano em Blindagem": case "Armor Damage":
            result = comp(getValue(a, 'DanoBlindagem'), getValue(b, 'DanoBlindagem'), dirNormal);
            break;
        case "Penetração": case "Penetration":
            result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'), dirNormal);
            break;
        case "Fragmentos": case "Fragments":
            result = comp(getValue(a, 'Fragmentos'), getValue(b, 'Fragmentos'), dirNormal);
            break;
        case "Tipo de Frags.": case "Frag Type":
            result = comp(getValue(a, 'TipoFragmento'), getValue(b, 'TipoFragmento'), dirNormal);
            break;
        case "Tempo Efeito": case "Effect Time": case "Tempo de Efeito":
            result = comp(getValue(a, 'TempoEfeito'), getValue(b, 'TempoEfeito'), dirNormal);
            break;
    }

    // Tie-Breakers baseados no script PS1 (aplicados sempre se o principal empatar)
    if (result === 0) result = comp(getValue(a, 'Alcance'), getValue(b, 'Alcance'), dirNormal);
    if (result === 0) result = comp(getDelay(a, 1), getDelay(b, 1), dirInverso);
    if (result === 0) result = comp(getDelay(a, 2), getDelay(b, 2), dirInverso);

    // Tie-Breakers Específicos
    if (result === 0 && (criterion.includes("Blindagem") || criterion.includes("Penetr") || criterion.includes("Frag"))) {
        result = comp(getValue(a, 'Penetracao'), getValue(b, 'Penetracao'), dirNormal);
        if (result === 0) result = comp(getValue(a, 'DanoBlindagem'), getValue(b, 'DanoBlindagem'), dirNormal);
    }

    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA CAPACETES ---
function compareHelmetsComplex(a, b, criterion, isDescending) {
    // Normal = Maior é Melhor (Descendente puxa o maior pro topo)
    const descNormal = isDescending ? -1 : 1; 
    // Inverso = Menor é Melhor (Peso, Penalidades, etc. Descendente puxa o menor pro topo)
    const descInverso = isDescending ? 1 : -1; 

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;

        if (col === 'BloqueioSom') return sortWeights.BloqueioHelmet[val] || 0;
        if (col === 'Ricochete') return sortWeights.RicocheteHelmet[val] || 0;
        if (col === 'Acessorio') return sortWeights.AcessorioHelmet[val] || 0;
        if (col === 'ReducaoRuido') return sortWeights.ReducaoHelmet[val] || 0;

        if (col === 'PenalidadeMovimento') return parseInt(String(val).replace('%', ''), 10) || 0;
        if (col === 'ClMaxMasc') return parseFloat(String(val).replace('*', '')) || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    // Define a direção principal baseado na regra do PowerShell
    switch (criterion) {
        case "Bloqueio de Som": case "Sound Block":
        case "Peso": case "Weight":
        case "Penalidade de Movimento": case "Movement Speed":
        case "Ergonomia": case "Ergonomics":
            primaryDir = descInverso;
            break;
        case "Alfabético": case "Alphabetical":
        case "Área Protegida": case "Protected Area":
            primaryDir = isDescending ? -1 : 1;
            break;
        default:
            primaryDir = descNormal;
            break;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Bloqueio de Som": case "Sound Block": result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), primaryDir); break;
        case "Chance de Ricochete": case "Ricochet Chance": result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), primaryDir); break;
        case "Acessório": case "Accessory": result = comp(getValue(a, 'Acessorio'), getValue(b, 'Acessorio'), primaryDir); break;
        case "Redução de Ruído": case "Noise Reduction": result = comp(getValue(a, 'ReducaoRuido'), getValue(b, 'ReducaoRuido'), primaryDir); break;
        case "Peso": case "Weight": result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); break;
        case "Durabilidade": case "Durability": result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), primaryDir); break;
        case "Classe de Blindagem": case "Armor Class": result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), primaryDir); break;
        case "Penalidade de Movimento": case "Movement Speed": result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), primaryDir); break;
        case "Ergonomia": case "Ergonomics": result = comp(getValue(a, 'Ergonomia'), getValue(b, 'Ergonomia'), primaryDir); break;
        case "Classe Máxima da Máscara Compatível": case "Max Mask Class": result = comp(getValue(a, 'ClMaxMasc'), getValue(b, 'ClMaxMasc'), primaryDir); break;
        case "Área Protegida": case "Protected Area": result = comp(getValue(a, 'AreaProtegida'), getValue(b, 'AreaProtegida'), primaryDir); break;
        case "Captura de Som": case "Sound Pickup": result = comp(getValue(a, 'CaptacaoSom'), getValue(b, 'CaptacaoSom'), primaryDir); break;
        case "Alfabético": case "Alphabetical": default: result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); break;
    }

    // 2. Critérios de Desempate Exatos (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                break;
            case "Durabilidade": case "Durability":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                break;
            case "Classe de Blindagem": case "Armor Class":
            case "Classe Máxima da Máscara Compatível": case "Max Mask Class":
                result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Bloqueio de Som": case "Sound Block":
            case "Penalidade de Movimento": case "Movement Speed":
            case "Ergonomia": case "Ergonomics":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0 && !criterion.includes("Bloqueio") && !criterion.includes("Sound")) {
                    result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                }
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                break;
            case "Área Protegida": case "Protected Area":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            default: // Alfabético, Acessório, Redução de Ruído, Captura de Som, etc
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'BloqueioSom'), getValue(b, 'BloqueioSom'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0 && !criterion.includes("Ricochet")) {
                    result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                }
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA MÁSCARAS ---
function compareMasksComplex(a, b, criterion, isDescending) {
    // Normal = Maior é Melhor (Descendente puxa o maior pro topo)
    const descNormal = isDescending ? -1 : 1; 
    // Inverso = Menor é Melhor (Peso. Descendente puxa o menor pro topo)
    const descInverso = isDescending ? 1 : -1; 

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;

        // Reaproveitando o peso de ricochete que criamos para os Capacetes (Low/Baixo=1, Medium/Médio=2, High/Alto=3)
        if (col === 'Ricochete') return sortWeights.RicocheteHelmet[val] || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    // Define a direção principal baseado na regra do PowerShell
    if (criterion === "Peso" || criterion === "Weight") {
        primaryDir = descInverso;
    } else if (criterion === "Alfabético" || criterion === "Alphabetical") {
        primaryDir = isDescending ? -1 : 1;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Durabilidade": case "Durability": 
            result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), primaryDir); 
            break;
        case "Classe de Blindagem": case "Armor Class": 
            result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), primaryDir); 
            break;
        case "Chance de Ricochete": case "Ricochet Chance": 
            result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate Exatos (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                break;
            case "Durabilidade": case "Durability":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Classe de Blindagem": case "Armor Class":
                result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Ricochete'), getValue(b, 'Ricochete'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Chance de Ricochete": case "Ricochet Chance":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA MÁSCARAS DE GÁS ---
function compareGasMasksComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;
        
        if (col === 'AntiVeneno' || col === 'AntiFlash') return sortWeights.GasMaskEffect[val] || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    if (criterion === "Peso" || criterion === "Weight") {
        primaryDir = descInverso;
    } else if (criterion === "Alfabético" || criterion === "Alphabetical") {
        primaryDir = isDescending ? -1 : 1;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Durabilidade": case "Durability": 
            result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), primaryDir); 
            break;
        case "Anti-Veneno": case "Anti-Poison": // <-- AQUI
            result = comp(getValue(a, 'AntiVeneno'), getValue(b, 'AntiVeneno'), primaryDir); 
            break;
        case "Anti-Flash": case "Anti-Flash":   // <-- AQUI
            result = comp(getValue(a, 'AntiFlash'), getValue(b, 'AntiFlash'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate (Tie-Breakers baseados no script antigo)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'AntiVeneno'), getValue(b, 'AntiVeneno'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'AntiFlash'), getValue(b, 'AntiFlash'), descNormal);
                break;
            case "Durabilidade": case "Durability":
                result = comp(getValue(a, 'AntiVeneno'), getValue(b, 'AntiVeneno'), descNormal);
                if (result === 0) result = comp(getValue(a, 'AntiFlash'), getValue(b, 'AntiFlash'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Anti-Veneno": case "Anti-Poison":
                result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'AntiFlash'), getValue(b, 'AntiFlash'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Anti-Flash": case "Anti-Flash":
                result = comp(getValue(a, 'AntiVeneno'), getValue(b, 'AntiVeneno'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA FONES DE OUVIDO ---
function compareHeadsetsComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////") return 0;
        
        if (col === 'CaptacaoSom' || col === 'ReducaoRuido') return sortWeights.HeadsetAudio[val] || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    if (criterion === "Peso" || criterion === "Weight") {
        primaryDir = descInverso;
    } else if (criterion === "Alfabético" || criterion === "Alphabetical") {
        primaryDir = isDescending ? -1 : 1;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Captação de Som": case "Captador de Som": case "Sound Pickup": // <- ATUALIZADO AQUI
            result = comp(getValue(a, 'CaptacaoSom'), getValue(b, 'CaptacaoSom'), primaryDir); 
            break;
        case "Redução de Ruído": case "Noise Reduction": 
            result = comp(getValue(a, 'ReducaoRuido'), getValue(b, 'ReducaoRuido'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate Exatos (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'CaptacaoSom'), getValue(b, 'CaptacaoSom'), descNormal);
                if (result === 0) result = comp(getValue(a, 'ReducaoRuido'), getValue(b, 'ReducaoRuido'), descNormal);
                break;
            case "Captação de Som": case "Captador de Som": case "Sound Pickup": // <- ATUALIZADO AQUI
                result = comp(getValue(a, 'ReducaoRuido'), getValue(b, 'ReducaoRuido'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Redução de Ruído": case "Noise Reduction":
                result = comp(getValue(a, 'CaptacaoSom'), getValue(b, 'CaptacaoSom'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA COLETES BALÍSTICOS ---
function compareArmorsComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////" || !val) return 0;
        
        if (col === 'AreaProtegida') return sortWeights.AreaArmor[val] || 0;
        
        // Remove o símbolo de % para converter penalidades negativas corretamente
        if (col === 'PenalidadeMovimento' || col === 'Ergonomia') {
            return parseInt(String(val).replace('%', ''), 10) || 0;
        }

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    // Define a direção principal (Peso é Inverso; Alfabético/Material é A-Z)
    if (criterion === "Peso" || criterion === "Weight") {
        primaryDir = descInverso;
    } else if (criterion === "Alfabético" || criterion === "Alphabetical" || criterion === "Material") {
        primaryDir = isDescending ? -1 : 1;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Durabilidade": case "Durability": 
            result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), primaryDir); 
            break;
        case "Classe de Blindagem": case "Armor Class": 
            result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), primaryDir); 
            break;
        case "Material": case "Material": 
            result = comp(getValue(a, 'Material'), getValue(b, 'Material'), primaryDir); 
            break;
        case "Penalidade de Movimento": case "Movement Speed": 
            result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), primaryDir); 
            break;
        case "Ergonomia": case "Ergonomics": 
            result = comp(getValue(a, 'Ergonomia'), getValue(b, 'Ergonomia'), primaryDir); 
            break;
        case "Área Protegida": case "Protected Area": 
            result = comp(getValue(a, 'AreaProtegida'), getValue(b, 'AreaProtegida'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), descNormal);
                break;
            case "Durabilidade": case "Durability":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0) result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), descNormal);
                break;
            case "Classe de Blindagem": case "Armor Class":
                result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0) result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), descNormal);
                break;
            case "Penalidade de Movimento": case "Movement Speed":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Material": case "Material":
            case "Ergonomia": case "Ergonomics":
            case "Área Protegida": case "Protected Area":
            default:
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                if (result === 0) result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), descNormal);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA COLETES BLINDADOS (RIGS) ---
function compareArmoredRigsComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////" || val === undefined) return 0;
        
        if (col === 'AreaProtegida') return sortWeights.AreaArmoredRig[val] || 0;
        if (col === 'PenalidadeMovimento' || col === 'Ergonomia') return parseInt(String(val).replace('%', ''), 10) || 0;

        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    if (criterion === "Peso" || criterion === "Weight") {
        primaryDir = descInverso;
    } else if (criterion === "Alfabético" || criterion === "Alphabetical") {
        primaryDir = isDescending ? -1 : 1;
    }

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); break;
        case "Durabilidade": case "Durability": result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), primaryDir); break;
        case "Classe de Blindagem": case "Armor Class": result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), primaryDir); break;
        case "Penalidade de Movimento": case "Movement Speed": result = comp(getValue(a, 'PenalidadeMovimento'), getValue(b, 'PenalidadeMovimento'), primaryDir); break;
        case "Ergonomia": case "Ergonomics": result = comp(getValue(a, 'Ergonomia'), getValue(b, 'Ergonomia'), primaryDir); break;
        case "Armazenamento": case "Storage Space": case "Espaço Armazenamento": result = comp(getValue(a, 'EspacoArmazenamento'), getValue(b, 'EspacoArmazenamento'), primaryDir); break;
        case "Área Protegida": case "Protected Area": result = comp(getValue(a, 'AreaProtegida'), getValue(b, 'AreaProtegida'), primaryDir); break;
        case "Conjunto de Blocos (HxV)": case "Block set (HxV)": result = comp(getValue(a, 'BlockSortingScore'), getValue(b, 'BlockSortingScore'), primaryDir); break;
        case "Alfabético": case "Alphabetical": default: result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); break;
    }

    // 2. Critérios de Desempate (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Armazenamento": case "Storage Space": case "Espaço Armazenamento":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                break;
            case "Peso": case "Weight":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                break;
            case "Durabilidade": case "Durability":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Classe de Blindagem": case "Armor Class":
                result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Ergonomia": case "Ergonomics":
            case "Área Protegida": case "Protected Area":
                result = comp(getValue(a, 'ClasseBlindagem'), getValue(b, 'ClasseBlindagem'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Durabilidade'), getValue(b, 'Durabilidade'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA COLETES NÃO BLINDADOS ---
function compareUnarmoredRigsComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso e Tamanho Desdobrado (Menor é Melhor)
    const descSetCount = isDescending ? 1 : -1; // Para contagem de bolsos (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////" || val === undefined) return (col === 'SetCount' || col === 'UnfoldedArea') ? 9999 : 0;
        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    if (criterion === "Peso" || criterion === "Weight") primaryDir = descInverso;
    else if (criterion === "Alfabético" || criterion === "Alphabetical") primaryDir = isDescending ? -1 : 1;

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Armazenamento": case "Storage Space": 
            result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), primaryDir); 
            break;
        case "Conjunto de Blocos (HxV)": case "Block set (HxV)": 
            result = comp(getValue(a, 'BlockSortingScore'), getValue(b, 'BlockSortingScore'), primaryDir); 
            break;
        case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space": 
            result = comp(getValue(a, 'Efficiency'), getValue(b, 'Efficiency'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                break;
            case "Armazenamento": case "Storage Space":
                result = comp(getValue(a, 'BlockSortingScore'), getValue(b, 'BlockSortingScore'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Efficiency'), getValue(b, 'Efficiency'), descNormal);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)":
                result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                break;
            case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space":
                result = comp(getValue(a, 'UnfoldedArea'), getValue(b, 'UnfoldedArea'), descInverso);
                if (result === 0) result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                if (result === 0) result = comp(getValue(a, 'SetCount'), getValue(b, 'SetCount'), descSetCount);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA MOCHILAS ---
function compareBackpacksComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para Peso e Tamanho Desdobrado (Menor é Melhor)
    const descSetCount = isDescending ? 1 : -1; // Para contagem de bolsos (Menor é Melhor)

    const getValue = (row, col) => {
        let val = row[col];
        if (val === "/////" || val === undefined) return (col === 'SetCount' || col === 'UnfoldedArea') ? 9999 : 0;
        const num = parseFloat(val);
        return isNaN(num) ? val : num;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    let result = 0;
    let primaryDir = descNormal;

    if (criterion === "Peso" || criterion === "Weight") primaryDir = descInverso;
    else if (criterion === "Alfabético" || criterion === "Alphabetical") primaryDir = isDescending ? -1 : 1;

    // 1. Critério Principal
    switch (criterion) {
        case "Peso": case "Weight": 
            result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), primaryDir); 
            break;
        case "Armazenamento": case "Storage Space": 
            result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), primaryDir); 
            break;
        case "Conjunto de Blocos (HxV)": case "Block set (HxV)": 
            result = comp(getValue(a, 'BlockSortingScore'), getValue(b, 'BlockSortingScore'), primaryDir); 
            break;
        case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space": 
            result = comp(getValue(a, 'Efficiency'), getValue(b, 'Efficiency'), primaryDir); 
            break;
        case "Alfabético": case "Alphabetical": default: 
            result = comp(getValue(a, 'NomeItem'), getValue(b, 'NomeItem'), primaryDir); 
            break;
    }

    // 2. Critérios de Desempate (Tie-Breakers)
    if (result === 0) {
        switch (criterion) {
            case "Peso": case "Weight":
                result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                break;
            case "Armazenamento": case "Storage Space":
                result = comp(getValue(a, 'BlockSortingScore'), getValue(b, 'BlockSortingScore'), descNormal);
                if (result === 0) result = comp(getValue(a, 'UnfoldedArea'), getValue(b, 'UnfoldedArea'), descInverso);
                if (result === 0) result = comp(getValue(a, 'Efficiency'), getValue(b, 'Efficiency'), descNormal);
                break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)":
                result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                break;
            case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space":
                result = comp(getValue(a, 'UnfoldedArea'), getValue(b, 'UnfoldedArea'), descInverso);
                if (result === 0) result = comp(getValue(a, 'EspacoTotal'), getValue(b, 'EspacoTotal'), descNormal);
                if (result === 0) result = comp(getValue(a, 'SetCount'), getValue(b, 'SetCount'), descSetCount);
                if (result === 0) result = comp(getValue(a, 'Peso'), getValue(b, 'Peso'), descInverso);
                break;
        }
    }
    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA FARMACÊUTICOS ---
let currentSubCategory = ""; // Variável global para armazenar a aba farmacêutica atual

function comparePharmaceuticalsComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; 
    let result = 0;

    // Converte os valores para números (removendo "/////" ou strings)
    const getNum = (row, col) => {
        let val = row[col];
        if (val === "/////" || val === undefined) return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const getStr = (row, col) => row[col] || "";

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    // --- ALFABÉTICO (FALLBACK PARA AS CATEGORIAS DINÂMICAS) ---
    if (criterion === "Alfabético" || criterion === "Alphabetical") {
        return comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), isDescending ? -1 : 1);
    }

    // --- CATEGORIAS FIXAS (Sem menu dinâmico - Usam apenas o critério "Padrão") ---
    if (currentSubCategory === 'Bandagem' || currentSubCategory === 'Nebulizador') {
        result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
        if (result === 0) result = comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), 1);
        return result;
    }
    
    if (currentSubCategory === 'Estimulantes') {
        result = comp(getStr(a, 'EfeitoPrincipal'), getStr(b, 'EfeitoPrincipal'), descNormal);
        if (result === 0) result = comp(getNum(a, 'Duracao'), getNum(b, 'Duracao'), descNormal);
        if (result === 0) result = comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), 1);
        return result;
    }

    // --- CATEGORIAS DINÂMICAS ---
    if (currentSubCategory === 'Analgesico') {
        switch (criterion) {
            case "Usos": case "Uses":
                result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Duracao'), getNum(b, 'Duracao'), descNormal);
                break;
            case "Duração": case "Duration":
                result = comp(getNum(a, 'Duracao'), getNum(b, 'Duracao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                break;
            case "Desidratação": case "Dehydration":
                result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Duracao'), getNum(b, 'Duracao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                break;
            case "Duração Máxima": case "Max Duration":
                result = comp(getNum(a, 'DurMax'), getNum(b, 'DurMax'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            default:
                result = comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), descNormal);
                break;
        }
    }
    else if (currentSubCategory === 'Kit cirurgico') {
        // Para calcular os slots ("2x2" -> 4)
        const getSlots = (row) => {
            const match = String(row.EspacoOcupado).match(/(\d+)x(\d+)/);
            if (match) return parseInt(match[1]) * parseInt(match[2]);
            return 1;
        };

        switch (criterion) {
            case "Usos": case "Uses":
                result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                if (result === 0) result = comp(getNum(a, 'RecuperacaoHP'), getNum(b, 'RecuperacaoHP'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Tempo de Atraso": case "Delay":
                result = comp(getNum(a, 'Delay'), getNum(b, 'Delay'), descInverso);
                if (result === 0) result = comp(getNum(a, 'RecuperacaoHP'), getNum(b, 'RecuperacaoHP'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Desidratação": case "Dehydration":
                result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'RecuperacaoHP'), getNum(b, 'RecuperacaoHP'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                break;
            case "Recuperação por Uso": case "HP Recovery":
                result = comp(getNum(a, 'RecuperacaoHP'), getNum(b, 'RecuperacaoHP'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Espaço (HxV)": case "Space (HxV)":
                result = comp(getSlots(a), getSlots(b), descInverso);
                if (result === 0) result = comp(getNum(a, 'RecuperacaoHP'), getNum(b, 'RecuperacaoHP'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Usos'), getNum(b, 'Usos'), descNormal);
                break;
            default:
                result = comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), descNormal);
                break;
        }
    }
    else if (currentSubCategory === 'Kit medico') {
        const getSlots = (row) => {
            const match = String(row.EspacoOcupado).match(/(\d+)x(\d+)/);
            if (match) return parseInt(match[1]) * parseInt(match[2]);
            return 1;
        };

        switch (criterion) {
            case "Durabilidade": case "Durability":
                result = comp(getNum(a, 'DurabilidadeTotal'), getNum(b, 'DurabilidadeTotal'), descNormal);
                if (result === 0) result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Desidratação": case "Dehydration":
                result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'DurabilidadeTotal'), getNum(b, 'DurabilidadeTotal'), descNormal);
                break;
            case "Velocidade de Cura": case "Healing Speed":
                result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                if (result === 0) result = comp(getNum(a, 'DurabilidadeTotal'), getNum(b, 'DurabilidadeTotal'), descNormal);
                break;
            case "Delay": case "Tempo de Atraso":
                result = comp(getNum(a, 'Delay'), getNum(b, 'Delay'), descInverso);
                if (result === 0) result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Espaço (HxV)": case "Space (HxV)":
                result = comp(getSlots(a), getSlots(b), descInverso);
                if (result === 0) result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            case "Durabilidade por Slot": case "Durability per Slot":
                result = comp(getNum(a, 'DurabSlot'), getNum(b, 'DurabSlot'), descNormal);
                if (result === 0) result = comp(getNum(a, 'VelocidadeCura'), getNum(b, 'VelocidadeCura'), descNormal);
                if (result === 0) result = comp(getNum(a, 'Desidratacao'), getNum(b, 'Desidratacao'), descNormal);
                break;
            default:
                result = comp(getStr(a, 'NomeItem'), getStr(b, 'NomeItem'), descNormal);
                break;
        }
    }

    return result;
}

// --- NOVO: MOTOR DE ORDENAÇÃO COMPLEXA PARA GASTRONOMIA ---
function compareGastronomyComplex(a, b, criterion, isDescending) {
    const descNormal = isDescending ? -1 : 1; 
    const descInverso = isDescending ? 1 : -1; // Para slots ocupados (Menor é Melhor)

    // Remove o "+" de valores de cura, mas preserva os negativos ("-")
    const getNum = (val) => {
        if (val === "/////" || val === undefined || val === null) return 0;
        const str = String(val).replace('+', '');
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    };

    // Extrai o tamanho dos slots a partir de textos como "1x2"
    const getSlots = (row) => {
        const match = String(row.EspacoOcupado).match(/(\d+)x(\d+)/);
        if (match) return parseInt(match[1], 10) * parseInt(match[2], 10);
        return 1;
    };

    const comp = (colA, colB, dir) => {
        if (colA < colB) return -1 * dir;
        if (colA > colB) return 1 * dir;
        return 0;
    };

    const hidA = getNum(a.Hidratacao); const hidB = getNum(b.Hidratacao);
    const engA = getNum(a.Energia); const engB = getNum(b.Energia);
    const slotsA = getSlots(a); const slotsB = getSlots(b);
    const hSlotA = slotsA > 0 ? (hidA / slotsA) : 0; const hSlotB = slotsB > 0 ? (hidB / slotsB) : 0;
    const eSlotA = slotsA > 0 ? (engA / slotsA) : 0; const eSlotB = slotsB > 0 ? (engB / slotsB) : 0;

    if (criterion === "Alfabético" || criterion === "Alphabetical") {
        return comp(a.NomeItem || "", b.NomeItem || "", isDescending ? -1 : 1);
    }

    let result = 0;
    switch (criterion) {
        case "Hidratação": case "Hydration":
            result = comp(hidA, hidB, descNormal);
            if (result === 0) result = comp(hSlotA, hSlotB, descNormal);
            if (result === 0) result = comp(slotsA, slotsB, descInverso);
            if (result === 0) result = comp(engA, engB, descNormal);
            break;
        case "Energia": case "Energy":
            result = comp(engA, engB, descNormal);
            if (result === 0) result = comp(eSlotA, eSlotB, descNormal);
            if (result === 0) result = comp(slotsA, slotsB, descInverso);
            if (result === 0) result = comp(hidA, hidB, descNormal);
            break;
        case "Hidratação por Slot": case "Hydration per Slot":
            result = comp(hSlotA, hSlotB, descNormal);
            if (result === 0) result = comp(slotsA, slotsB, descInverso);
            if (result === 0) result = comp(hidA, hidB, descNormal);
            if (result === 0) result = comp(eSlotA, eSlotB, descNormal);
            break;
        case "Energia por Slot": case "Energy per Slot":
            result = comp(eSlotA, eSlotB, descNormal);
            if (result === 0) result = comp(slotsA, slotsB, descInverso);
            if (result === 0) result = comp(engA, engB, descNormal);
            if (result === 0) result = comp(hSlotA, hSlotB, descNormal);
            break;
        default:
            result = comp(a.NomeItem || "", b.NomeItem || "", descNormal);
            break;
    }
    return result;
}

// =====================================================================
// MOTOR DE FILTROS CRUZADOS REATIVOS
// =====================================================================
let globalFilters = {}; // Salva os filtros ativos globalmente: { 'weapons': { 'ClasseDisplay': ['Pistola'] } }
let tempFilters = {};   // Salva cliques temporários enquanto a janela está aberta
let currentFilterDefs = []; 

function getFilterConfig(mode) {
    const t = translations[currentLang];
    
    switch (mode) {
        case 'weapons':
            return {
                title: t.filterModals.titleWeapons,
                definitions: [
                    {
                        prop: "ClasseDisplay", baseProp: "Classe", baseCat: "weapons",
                        title: t.filterModals.colCategory, 
                        // APENAS AS ÂNCORAS EM INGLÊS NA ORDEM DESEJADA
                        customOrder: ["CARBINE", "SHOTGUN", "MARKSMAN RIFLE", "LIGHT MACHINE GUN", "PISTOL", "ASSAULT RIFLE", "BOLT-ACTION RIFLE", "SUBMACHINE GUN"]
                    },
                    {
                        prop: "Calibre", baseProp: "Calibre", baseCat: "weapons",
                        title: t.filterModals.colCaliber, 
                        customOrder: [".338", ".44", ".45", "12x70mm", "5.45x39mm", "5.56x45mm", "5.7x28mm", "5.8x42mm", "7.62x25mm", "7.62x39mm", "7.62x51mm", "7.62x54mm", "9x19mm", "9x39mm"]
                    },
                    {
                        prop: "ModoDisparoDisplay", baseProp: "ModoDisparo", baseCat: "weapons",
                        title: t.filterModals.colFireMode, 
                        customOrder: ["Pump-Action", "Bolt-Action", "3-RB", "Semi", "Semi, 3-RB", "Full", "Semi, Full", "2-RB, Semi, Full", "3-RB, Semi, Full"]
                    },
                    {
                        prop: "PoderFogoDisplay", baseProp: "PoderFogo", baseCat: "weapons",
                        title: t.filterModals.colFirepower, 
                        customOrder: ["Low", "Mid-Low", "Medium", "Mid-High", "High", "Ultra High"]
                    },
                    {
                        prop: "CanoDisplay", baseProp: "TipoCano", baseCat: "weapons",
                        title: t.filterModals.colBarrel, 
                        customOrder: [
                            "CFSB D-", "FBNMD-", 
                            "CFSB", "FBNM", 
                            "CFSB D+", "FBNMD+", 
                            "CF D-", "FB D-", 
                            "CF", "FB", 
                            "CF D+", "FB D+", 
                            "CustomD-", "Custom D-", 
                            "Custom", 
                            "CustomD+", "Custom D+",
                            "Default -", 
                            "Default", 
                            "Default +",
                            "R+ WD-", "A+ DA-", 
                            "R+", "A+", 
                            "R+ WD+", "A+ DA+", 
                            "D+", 
                            "D+ R+ WD-", "D+ A+ DA-", 
                            "D+ R+", "D+ A+", 
                            "D+ R+ WD+", "D+ A+ DA+"
                        ]
                    }
                ]
            };
            
        case 'ammo':
            return {
                title: t.filterModals.titleAmmo,
                definitions: [
                    {
                        prop: "NivelPenetracao", 
                        title: t.filterModals.colLevels,
                        customOrder: null 
                    },
                    {
                        prop: "Calibre", 
                        title: t.filterModals.colCaliber, 
                        customOrder: null 
                    },
                    {
                        prop: "ChanceFerirDisplay", baseProp: "ChanceFerir", baseCat: "ammo",
                        title: t.filterModals.colWound, 
                        customOrder: ["//////", "Low", "Medium", "High"] 
                    }
                ]
            };

        case 'helmets':
            return {
                title: t.filterModals.titleHelmets,
                definitions: [
                    { 
                        prop: "ClasseBlindagem", 
                        title: t.filterModals.colClassCl, 
                        customOrder: ["1", "2", "3", "4", "5", "6"] 
                    },
                    { 
                        prop: "BloqueioDisplay", baseProp: "BloqueioSom", baseCat: "helmets",
                        title: t.filterModals.colSoundBlock, 
                        customOrder: ["/////", "Low", "Moderate", "Severe"] 
                    },
                    { 
                        prop: "AreaDisplay", baseProp: "AreaProtegida", baseCat: "helmets",
                        title: t.filterModals.colArea, 
                        customOrder: ["Head", "Head, Ears", "Head, Ears, Face"] 
                    },
                    { 
                        prop: "RicochDisplay", baseProp: "Ricochete", baseCat: "helmets",
                        title: t.filterModals.colRico, 
                        customOrder: ["/////", "Low", "Medium", "High"] 
                    },
                    { 
                        prop: "AcessorioDisplay", baseProp: "Acessorio", baseCat: "helmets",
                        title: t.filterModals.colAccessory, 
                        customOrder: ["/////", "Mask", "TE", "Mask, TE"] 
                    },
                    { 
                        prop: "ClMaxMascValue", 
                        title: t.filterModals.colMaxMask, 
                        customOrder: ["/////", "1", "2", "3", "4", "5", "6"] 
                    }
                ]
            };

        case 'bodyArmor':
            return {
                title: t.filterModals.titleArmor,
                definitions: [
                    { 
                        prop: "ClasseBlindagem", 
                        title: t.filterModals.colArmorClass, 
                        customOrder: ["1", "2", "3", "4", "5", "6"] 
                    },
                    { 
                        prop: "AreaProtegida", baseProp: "AreaProtegida", baseCat: "bodyArmor",
                        title: t.filterModals.colArea, 
                        customOrder: ["Chest", "Chest, Upper Abdomen", "Chest, Upper Abdomen, Lower Abdomen", "Chest, Shoulder, Upper Abdomen", "Chest, Shoulder, Upper Abdomen, Lower Abdomen"] 
                    }
                ]
            };

        case 'armoredRigs':
            return {
                title: t.filterModals.titleRigs,
                definitions: [
                    { 
                        prop: "ClasseBlindagem", 
                        title: t.filterModals.colArmorClass, 
                        customOrder: ["1", "2", "3", "4", "5", "6"] 
                    },
                    { 
                        prop: "AreaProtegida", baseProp: "AreaProtegida", baseCat: "armoredRigs",
                        title: t.filterModals.colArea, 
                        customOrder: ["Chest", "Chest, Upper Abdomen", "Chest, Upper Abdomen, Lower Abdomen", "Chest, Shoulder, Upper Abdomen, Lower Abdomen"] 
                    }
                ]
            };
            
        default: return null;
    }
}

function openFilterModal() {
    const config = getFilterConfig(currentSearchMode);
    if (!config) return;

    currentFilterDefs = config.definitions;
    document.getElementById('filter-modal-title').textContent = config.title;

    if (!globalFilters[currentSearchMode]) globalFilters[currentSearchMode] = {};

    // Inicia os Filtros Temporários clonando os globais
    tempFilters = {};
    currentFilterDefs.forEach(def => {
        if (globalFilters[currentSearchMode][def.prop]) {
            tempFilters[def.prop] = [...globalFilters[currentSearchMode][def.prop]];
        } else {
            tempFilters[def.prop] = [];
        }
    });

    const container = document.getElementById('filter-columns-container');
    container.innerHTML = ''; 

    currentFilterDefs.forEach((def, colIndex) => {
        const colDiv = document.createElement('div'); colDiv.className = 'filter-column';
        const titleDiv = document.createElement('div'); titleDiv.className = 'filter-column-title'; titleDiv.textContent = def.title;
        const contentDiv = document.createElement('div'); contentDiv.className = 'filter-column-content'; contentDiv.id = `filter-col-${colIndex}`;
        colDiv.appendChild(titleDiv); colDiv.appendChild(contentDiv); container.appendChild(colDiv);
    });

    document.getElementById('filter-modal-overlay').classList.remove('hidden-section');
    updateFilterUI(); // Renderiza a tela pela primeira vez
}

function closeFilterModal() {
    document.getElementById('filter-modal-overlay').classList.add('hidden-section');
}

function updateFilterUI() {
    let baseData = db[currentSearchMode] || [];
    
    if (currentSearchMode === 'weapons') {
        baseData = baseData.map(row => {
            let nRow = { ...row };
            if (currentLang !== 'en') {
                nRow.ClasseDisplay = traduzirDado('weapons', 'Classe', row.Classe);
                nRow.ModoDisparoDisplay = traduzirDado('weapons', 'ModoDisparo', row.ModoDisparo);
                nRow.PoderFogoDisplay = traduzirDado('weapons', 'PoderFogo', row.PoderFogo);
                nRow.CanoDisplay = traduzirDado('weapons', 'TipoCano', row.TipoCano);
            } else {
                nRow.ClasseDisplay = row.Classe;
                nRow.ModoDisparoDisplay = row.ModoDisparo;
                nRow.PoderFogoDisplay = row.PoderFogo;
                nRow.CanoDisplay = row.TipoCano;
            }
            return nRow;
        });
    }
    else if (currentSearchMode === 'ammo') {
        baseData = baseData.map(row => {
            let nRow = { ...row };
            let chanceVal = row.ChanceFerir;
            if (!chanceVal || chanceVal === "/////") chanceVal = "//////"; 
            
            if (currentLang !== 'en') { nRow.ChanceFerirDisplay = traduzirDado('ammo', 'ChanceFerir', chanceVal); } 
            else { nRow.ChanceFerirDisplay = chanceVal; }
            return nRow;
        });
    }
    else if (currentSearchMode === 'helmets') {
        baseData = baseData.map(row => {
            let nRow = { ...row };
            nRow.ClMaxMasc = getHelmetMaskClass(nRow); 
            nRow.ClMaxMascValue = nRow.ClMaxMasc.replace('*', ''); 

            let blockVal = row.BloqueioSom; if (!blockVal || blockVal === "//////") blockVal = "/////";
            let areaVal = row.AreaProtegida; if (!areaVal || areaVal === "//////") areaVal = "/////";
            let ricochVal = row.Ricochete; if (!ricochVal || ricochVal === "//////") ricochVal = "/////";
            let acessVal = row.Acessorio; if (!acessVal || acessVal === "//////") acessVal = "/////";

            if (currentLang !== 'en') {
                nRow.BloqueioDisplay = traduzirDado('helmets', 'BloqueioSom', blockVal);
                nRow.AreaDisplay = traduzirDado('helmets', 'AreaProtegida', areaVal);
                nRow.RicochDisplay = traduzirDado('helmets', 'Ricochete', ricochVal);
                nRow.AcessorioDisplay = traduzirDado('helmets', 'Acessorio', acessVal);
            } else {
                nRow.BloqueioDisplay = blockVal;
                nRow.AreaDisplay = areaVal;
                nRow.RicochDisplay = ricochVal;
                nRow.AcessorioDisplay = acessVal;
            }
            return nRow;
        });
    }
    else if (currentSearchMode === 'bodyArmor') {
        baseData = baseData.map(row => {
            let nRow = { ...row };
            if (currentLang !== 'en') { nRow.AreaProtegida = traduzirDado('bodyArmor', 'AreaProtegida', row.AreaProtegida); } 
            return nRow;
        });
    }
    else if (currentSearchMode === 'armoredRigs') {
        baseData = baseData.map(row => {
            let nRow = { ...row };
            if (currentLang !== 'en') { nRow.AreaProtegida = traduzirDado('armoredRigs', 'AreaProtegida', row.AreaProtegida); } 
            return nRow;
        });
    }

    let survivors = [];
    baseData.forEach(item => {
        let isSurvivor = true;
        for (let prop in tempFilters) {
            if (tempFilters[prop].length === 0) continue;
            if (tempFilters[prop].includes(String(item[prop]))) { isSurvivor = false; break; }
        }
        if (isSurvivor) survivors.push(item);
    });

    let availableValues = {};
    currentFilterDefs.forEach(def => availableValues[def.prop] = new Set());
    survivors.forEach(item => {
        currentFilterDefs.forEach(def => {
            let val = String(item[def.prop]);
            if (val && val.trim() !== "") availableValues[def.prop].add(val);
        });
    });

    currentFilterDefs.forEach((def, colIndex) => {
        const contentDiv = document.getElementById(`filter-col-${colIndex}`);
        contentDiv.innerHTML = ''; 

        let rawValuesSet = new Set();
        baseData.forEach(item => { let val = String(item[def.prop]); if (val && val.trim() !== "") rawValuesSet.add(val); });
        let rawValues = Array.from(rawValuesSet);

        // --- A MÁGICA DA ÂNCORA INGLESA (TRADUTOR INVISÍVEL) ---
        let orderedValues = [...rawValues];
        if (def.customOrder) {
            orderedValues.sort((a, b) => {
                let enA = a; 
                let enB = b;
                
                // Se não for inglês, ele rastreia de volta a palavra raiz em inglês no Dicionário
                if (currentLang !== 'en' && def.baseProp && def.baseCat) {
                    const dict = translations[currentLang].dataDict?.[def.baseCat]?.[def.baseProp];
                    if (dict) {
                        const foundA = Object.keys(dict).find(k => dict[k] === a);
                        if (foundA) enA = foundA;
                        const foundB = Object.keys(dict).find(k => dict[k] === b);
                        if (foundB) enB = foundB;
                    }
                }
                
                let indexA = def.customOrder.indexOf(enA);
                let indexB = def.customOrder.indexOf(enB);
                
                // Se a palavra não existir na lista mestre, joga pro fundo
                if (indexA === -1) indexA = 999;
                if (indexB === -1) indexB = 999;
                
                if (indexA !== indexB) return indexA - indexB;
                return a.localeCompare(b); // Desempate Alfabético padrão
            });
        } else {
            orderedValues.sort((a, b) => {
                let numA = parseFloat(a); let numB = parseFloat(b);
                if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return a.localeCompare(b);
            });
        }

        orderedValues.forEach(val => {
            if (val.trim() === "" && val !== "/////" && val !== "//////") return;

            const label = document.createElement('label'); label.className = 'filter-checkbox-label';
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
            
            // Lógica Dinâmica dos Tooltips de Cano
            if (currentSearchMode === 'weapons' && def.prop === 'CanoDisplay') {
                let rawVal = val;
                if (currentLang !== 'en') {
                    const dicCano = translations[currentLang].dataDict?.weapons?.TipoCano;
                    if (dicCano) {
                        const foundKey = Object.keys(dicCano).find(k => dicCano[k] === val);
                        if (foundKey) rawVal = foundKey;
                    }
                }
                const tooltipText = translations[currentLang].tooltipBarrel ? translations[currentLang].tooltipBarrel[rawVal] : null;
                if (tooltipText) { label.title = tooltipText; label.classList.add('has-dynamic-tooltip'); }
            }

            if (tempFilters[def.prop].includes(val)) {
                label.classList.add('state-M'); checkbox.checked = true; checkbox.disabled = false;
            } else if (!availableValues[def.prop].has(val)) {
                label.classList.add('state-A'); checkbox.checked = true; checkbox.disabled = true;
            } else {
                label.classList.add('state-F'); checkbox.checked = false; checkbox.disabled = false;
            }

            checkbox.addEventListener('change', (e) => {
                if (checkbox.disabled) return;
                if (checkbox.checked) { tempFilters[def.prop].push(val); } else { tempFilters[def.prop] = tempFilters[def.prop].filter(item => item !== val); }
                updateFilterUI();
            });

            label.appendChild(checkbox); label.appendChild(document.createTextNode(" " + val));
            contentDiv.appendChild(label);
        });
    });
}

function resetCurrentFilters() {
    for (let prop in tempFilters) { tempFilters[prop] = []; }
    updateFilterUI();
}

function confirmCurrentFilters() {
    globalFilters[currentSearchMode] = {};
    for (let prop in tempFilters) { globalFilters[currentSearchMode][prop] = [...tempFilters[prop]]; }
    closeFilterModal();
    updateFilterButtonVisual();
    renderDataTable(); 
}

function updateFilterButtonVisual() {
    const btn = document.getElementById('btn-filter');
    if (!btn) return;
    
    let hasActiveFilters = false;
    if (globalFilters[currentSearchMode]) {
        for (let prop in globalFilters[currentSearchMode]) {
            if (globalFilters[currentSearchMode][prop].length > 0) {
                hasActiveFilters = true; break;
            }
        }
    }

    if (hasActiveFilters) { 
        btn.classList.add('btn-filter-active'); 
        
        // NOVO: Trava de Segurança para Munição - Se usar Filtro Manual, bloqueia os menus dropdown
        if (currentSearchMode === 'ammo') {
            const cbCat = document.getElementById('cbAmmoCat');
            const cbWep = document.getElementById('cbAmmoWep');
            if (cbCat) cbCat.classList.add('ui-locked');
            if (cbWep) cbWep.classList.add('ui-locked');
        }
    } 
    else { 
        btn.classList.remove('btn-filter-active'); 
        
        // NOVO: Se limpou os Filtros Manuais, destranca os menus de Arma
        if (currentSearchMode === 'ammo') {
            const cbCat = document.getElementById('cbAmmoCat');
            const cbWep = document.getElementById('cbAmmoWep');
            if (cbCat) cbCat.classList.remove('ui-locked');
            if (cbWep) cbWep.classList.remove('ui-locked');
        }
    }
}

function renderDataTable() {
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');
    const lblCount = document.getElementById('lbl-count');
    const t = translations[currentLang];

    thead.innerHTML = '';
    tbody.innerHTML = '';

    let baseData = [];
    if (currentSearchMode === 'food_all') {
        baseData = (db.food_items || []).concat(db.food_beverages || []);
    } else {
        baseData = db[currentSearchMode] || [];
    }

    if (!baseData || baseData.length === 0) {
        lblCount.textContent = t.msgZeroItemsLoad;
        return;
    }

    const config = getViewConfig(currentSearchMode);
    if (!config) return;

    // =========================================================
    // LÓGICA DO FILTRO REVERSO DE MUNIÇÃO (CRUZAMENTO DE DADOS)
    // =========================================================
    if (currentSearchMode === 'ammo') {
        if (ammoActiveWeapon !== "Todas") {
            const wepObj = db.weapons.find(w => w.NomeItem === ammoActiveWeapon);
            if (wepObj && wepObj.Calibre) {
                baseData = baseData.filter(ammo => ammo.Calibre === wepObj.Calibre);
            }
        } 
        else if (ammoActiveCategory !== "Todas") {
            const wepsInCat = db.weapons.filter(w => {
                let catName = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', w.Classe) : w.Classe;
                return catName === ammoActiveCategory;
            });
            let validCals = new Set();
            wepsInCat.forEach(w => validCals.add(w.Calibre));
            baseData = baseData.filter(ammo => validCals.has(ammo.Calibre));
        }
    }

    let displayData = baseData.map(row => {
        let newRow = { ...row }; 
        
        if (currentSearchMode === 'weapons') {
            if (currentLang !== 'en') {
                newRow.ClasseDisplay = traduzirDado('weapons', 'Classe', row.Classe);
                newRow.ModoDisparoDisplay = traduzirDado('weapons', 'ModoDisparo', row.ModoDisparo);
                newRow.PoderFogoDisplay = traduzirDado('weapons', 'PoderFogo', row.PoderFogo);
                newRow.CanoDisplay = traduzirDado('weapons', 'TipoCano', row.TipoCano);
            } else {
                newRow.ClasseDisplay = row.Classe;
                newRow.ModoDisparoDisplay = row.ModoDisparo;
                newRow.PoderFogoDisplay = row.PoderFogo;
                newRow.CanoDisplay = row.TipoCano;
            }
        }
        else if (currentSearchMode === 'ammo') {
            let chanceVal = row.ChanceFerir;
            if (!chanceVal || chanceVal === "/////") chanceVal = "//////";
            
            if (currentLang !== 'en') { newRow.ChanceFerirDisplay = traduzirDado('ammo', 'ChanceFerir', chanceVal); } 
            else { newRow.ChanceFerirDisplay = chanceVal; }
        }
        else if (currentSearchMode === 'helmets') {
            newRow.ClMaxMasc = getHelmetMaskClass(newRow); 
            newRow.ClMaxMascValue = newRow.ClMaxMasc.replace('*', ''); 

            let blockVal = row.BloqueioSom; if (!blockVal || blockVal === "//////") blockVal = "/////";
            let areaVal = row.AreaProtegida; if (!areaVal || areaVal === "//////") areaVal = "/////";
            let ricochVal = row.Ricochete; if (!ricochVal || ricochVal === "//////") ricochVal = "/////";
            let acessVal = row.Acessorio; if (!acessVal || acessVal === "//////") acessVal = "/////";

            if (currentLang !== 'en') {
                newRow.BloqueioDisplay = traduzirDado('helmets', 'BloqueioSom', blockVal);
                newRow.AreaDisplay = traduzirDado('helmets', 'AreaProtegida', areaVal);
                newRow.RicochDisplay = traduzirDado('helmets', 'Ricochete', ricochVal);
                newRow.AcessorioDisplay = traduzirDado('helmets', 'Acessorio', acessVal);
            } else {
                newRow.BloqueioDisplay = blockVal;
                newRow.AreaDisplay = areaVal;
                newRow.RicochDisplay = ricochVal;
                newRow.AcessorioDisplay = acessVal;
            }
        }
        else if (currentSearchMode === 'bodyArmor') {
            if (currentLang !== 'en') { newRow.AreaProtegida = traduzirDado('bodyArmor', 'AreaProtegida', row.AreaProtegida); } 
        }
        else if (currentSearchMode === 'armoredRigs') {
            if (currentLang !== 'en') { newRow.AreaProtegida = traduzirDado('armoredRigs', 'AreaProtegida', row.AreaProtegida); } 

            const storageVal = parseInt(newRow.EspacoArmazenamento) || 0;
            let maxBlockArea = 0; let countOfMaxBlock = 0; let layoutStr = String(newRow.LayoutInterno || "");
            
            if (layoutStr !== '/////' && layoutStr.trim() !== '') {
                const parts = layoutStr.split(',').map(s => s.trim());
                parts.forEach(part => {
                    let count = 1; let dims = part;
                    const matchCount = part.match(/^\((\d+)\)(.+)/);
                    if (matchCount) { count = parseInt(matchCount[1], 10); dims = matchCount[2]; }
                    const matchArea = dims.match(/(\d+)x(\d+)/);
                    if (matchArea) {
                        const area = parseInt(matchArea[1], 10) * parseInt(matchArea[2], 10);
                        if (area > maxBlockArea) { maxBlockArea = area; countOfMaxBlock = count; } 
                        else if (area === maxBlockArea) { countOfMaxBlock += count; }
                    }
                });
            }
            newRow.BlockSortingScore = (maxBlockArea * 100) + (storageVal * 10) + countOfMaxBlock;
        }

        if (currentSearchMode === 'food_all' || currentSearchMode === 'food_items' || currentSearchMode === 'food_beverages') {
            const hidra = parseFloat(newRow.Hidratacao) || 0;
            const energia = parseFloat(newRow.Energia) || 0;
            const area = calculateArea(newRow.EspacoOcupado);
            
            const valHidrat = area > 0 ? parseFloat((hidra / area).toFixed(1)) : 0;
            const valEnerg = area > 0 ? parseFloat((energia / area).toFixed(1)) : 0;

            newRow.HidratSlot = valHidrat === 0 ? "/////" : valHidrat;
            newRow.EnergSlot = valEnerg === 0 ? "/////" : valEnerg;
        }
        else if (currentSearchMode === 'medical_painkillers') {
            const usos = parseInt(newRow.Usos) || 0;
            const duracao = parseInt(newRow.Duracao) || 0;
            const desidratacao = parseFloat(newRow.Desidratacao) || 0;
            
            newRow.DurMax = usos * duracao; 
            const valDesMax = parseFloat((usos * desidratacao).toFixed(1));
            newRow.DesMax = valDesMax === 0 ? "/////" : valDesMax;
        }
        else if (currentSearchMode === 'medical_medkits') {
            const durab = parseFloat(newRow.DurabilidadeTotal) || 0;
            const area = calculateArea(newRow.EspacoOcupado);
            newRow.DurabSlot = area > 0 ? parseFloat((durab / area).toFixed(1)) : 0;
        }
        else if (currentSearchMode === 'backpacks' || currentSearchMode === 'unarmoredRigs') {
            const espaco = parseInt(newRow.EspacoTotal) || 0;
            const area = calculateArea(newRow.TamanhoDesdobrada);
            const diff = espaco - area;
            
            newRow.EficienciaDisplay = diff >= 0 ? `+${diff}` : `${diff}`;
            newRow.Efficiency = diff;
            newRow.UnfoldedArea = area;

            let maxBlockArea = 0;
            let countOfMaxBlock = 0;
            let setCount = 0;
            let layoutStr = String(newRow.LayoutInterno || "");

            if (layoutStr !== '/////' && layoutStr.trim() !== '') {
                const parts = layoutStr.split(',').map(s => s.trim());
                parts.forEach(part => {
                    let count = 1;
                    let dims = part;
                    const matchCount = part.match(/^\((\d+)\)(.+)/);
                    if (matchCount) {
                        count = parseInt(matchCount[1], 10);
                        dims = matchCount[2];
                    } else {
                        const matchCountOnly = part.match(/^\((\d+)\)$/);
                        if (matchCountOnly) {
                            count = parseInt(matchCountOnly[1], 10);
                            dims = "0x0";
                        }
                    }
                    setCount += count;

                    const matchArea = dims.match(/(\d+)x(\d+)/);
                    if (matchArea) {
                        const blockArea = parseInt(matchArea[1], 10) * parseInt(matchArea[2], 10);
                        if (blockArea > maxBlockArea) {
                            maxBlockArea = blockArea;
                            countOfMaxBlock = count;
                        } else if (blockArea === maxBlockArea) {
                            countOfMaxBlock += count;
                        }
                    }
                });
            } else {
                setCount = 999;
            }
            newRow.BlockSortingScore = (maxBlockArea * 1000) + countOfMaxBlock;
            newRow.SetCount = setCount;
        }
        
        return newRow;
    });

    if (globalFilters[currentSearchMode]) {
        displayData = displayData.filter(item => {
            let isSurvivor = true;
            for (let prop in globalFilters[currentSearchMode]) {
                const banList = globalFilters[currentSearchMode][prop];
                if (banList && banList.length > 0) {
                    if (banList.includes(String(item[prop]))) {
                        isSurvivor = false;
                        break;
                    }
                }
            }
            return isSurvivor;
        });
    }

    lblCount.textContent = `${t.msgShowingItemsPrefix}${displayData.length}${t.msgShowingItemsSuffix}`;

    const criteriaSelect = document.getElementById('criteria-select');
    const orderSelect = document.getElementById('order-select');
    let selectedCriterion = criteriaSelect ? criteriaSelect.value : "Padrão";
    const isDescending = orderSelect ? (orderSelect.value === 'desc') : false;

    // --- MÁGICA DE ESTABILIDADE UNIVERSAL (O Tradutor Fantasma) ---
    // Se o idioma não for Inglês, ele acha o index da palavra clicada e puxa o equivalente em Inglês do Dicionário
    if (currentLang !== 'en' && selectedCriterion !== "Padrão" && config) {
        const localIndex = config.criteria.indexOf(selectedCriterion);
        if (localIndex !== -1) {
            const savedLang = currentLang;
            currentLang = 'en'; // Engana o sistema rapidamente
            const enConfig = getViewConfig(currentSearchMode);
            currentLang = savedLang; // Devolve o idioma original
            if (enConfig && enConfig.criteria[localIndex]) {
                selectedCriterion = enConfig.criteria[localIndex]; // O motor recebe apenas Inglês!
            }
        }
    }

    if (currentSearchMode.startsWith('medical_')) {
        switch(currentSearchMode) {
            case 'medical_painkillers': currentSubCategory = 'Analgesico'; break;
            case 'medical_bandages': currentSubCategory = 'Bandagem'; break;
            case 'medical_surgical': currentSubCategory = 'Kit cirurgico'; break;
            case 'medical_nebulizers': currentSubCategory = 'Nebulizador'; break;
            case 'medical_medkits': currentSubCategory = 'Kit medico'; break;
            case 'medical_stimulants': currentSubCategory = 'Estimulantes'; break;
        }
    } else {
        currentSubCategory = "";
    }

    if (displayData.length > 0 && selectedCriterion) {
        displayData.sort((a, b) => {
            if (currentSearchMode === 'helmets') return compareHelmetsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'weapons') return compareWeaponsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'ammo') return compareAmmoComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'grenades') return compareGrenadesComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'masks') return compareMasksComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'gasMasks') return compareGasMasksComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'headsets') return compareHeadsetsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'bodyArmor') return compareArmorsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'armoredRigs') return compareArmoredRigsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'unarmoredRigs') return compareUnarmoredRigsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode === 'backpacks') return compareBackpacksComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode.startsWith('medical_')) return comparePharmaceuticalsComplex(a, b, selectedCriterion, isDescending);
            if (currentSearchMode.startsWith('food_')) return compareGastronomyComplex(a, b, selectedCriterion, isDescending);

            const dir = isDescending ? -1 : 1;
            let valA = a['NomeItem'] || "";
            let valB = b['NomeItem'] || "";
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
        });
    }

    let targetKey = "NomeItem"; 
    
    if (currentSearchMode === 'weapons') {
        switch (selectedCriterion) {
            case "Controle de Recuo Vertical": case "Vertical Recoil Control": targetKey = "RecuoVertical"; break;
            case "Controle de Recuo Horizontal": case "Horizontal Recoil Control": targetKey = "RecuoHorizontal"; break;
            case "Ergonomia": case "Ergonomics": targetKey = "Ergonomia"; break;
            case "Estabilidade da Arma": case "Weapon Stability": targetKey = "EstabilidadeArma"; break;
            case "Precisão": case "Accuracy": targetKey = "Precisao"; break;
            case "Estabilidade sem Mirar": case "Hip-fire stability": targetKey = "EstabilidadeHipFire"; break;
            case "Distância Efetiva": case "Effective Range": targetKey = "Alcance"; break;
            case "Velocidade de Saída": case "Muzzle Velocity": targetKey = "VelocidadeBocal"; break;
            case "Modo de Disparo": case "Fire Mode": targetKey = "ModoDisparo"; break;
            case "Cadência": case "Rate of Fire": targetKey = "Cadencia"; break;
            case "Poder de Fogo": case "Firepower": targetKey = "PoderFogo"; break;
            case "Melhoria de Cano (Perfil da Arma)": case "Barrel Upgrade (Weapon Profile)": targetKey = "TipoCano"; break;
        }
    }
    else if (currentSearchMode === 'ammo') {
        switch (selectedCriterion) {
            case "Nível de Penetração": case "Penetration Level": targetKey = "NivelPenetracao"; break;
            case "Penetração": case "Penetration": targetKey = "Penetracao"; break;
            case "Dano Base": case "Base Damage": targetKey = "DanoBase"; break;
            case "Dano de Blindagem": case "Armor Damage": targetKey = "DanoBlindagem"; break;
            case "Ferimento Contuso": case "Blunt Trauma": targetKey = "FerimentoContuso"; break;
            case "Velocidade Inicial": case "Muzzle Velocity": targetKey = "Velocidade"; break;
            case "Precisão": case "Accuracy": targetKey = "Precisao"; break;
            case "Controle de Recuo Vertical": case "Vertical Recoil Control": targetKey = "RecuoVertical"; break;
            case "Controle de Recuo Horizontal": case "Horizontal Recoil Control": targetKey = "RecuoHorizontal"; break;
            case "Chance de Ferir": case "Wound Chance": targetKey = "ChanceFerir"; break;
        }
    }
    else if (currentSearchMode === 'grenades') {
        switch (selectedCriterion) {
            case "Delay de Explosão": case "Explosion Delay": targetKey = "DelayExplosao"; break;
            case "Alcance": case "Range": targetKey = "Alcance"; break;
            case "Dano em Blindagem": case "Armor Damage": targetKey = "DanoBlindagem"; break;
            case "Penetração": case "Penetration": targetKey = "Penetracao"; break;
            case "Fragmentos": case "Fragments": targetKey = "Fragmentos"; break;
            case "Tipo de Frags.": case "Frag Type": targetKey = "TipoFragmento"; break;
            case "Tempo de Efeito": case "Tempo Efeito": case "Effect Time": targetKey = "TempoEfeito"; break;
        }
    }
    else if (currentSearchMode === 'helmets') {
        switch (selectedCriterion) {
            case "Bloqueio de Som": case "Sound Block": targetKey = "BloqueioSom"; break;
            case "Chance de Ricochete": case "Ricochet Chance": targetKey = "Ricochete"; break;
            case "Acessório": case "Accessory": targetKey = "Acessorio"; break;
            case "Redução de Ruído": case "Noise Reduction": targetKey = "ReducaoRuido"; break;
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Durabilidade": case "Durability": targetKey = "Durabilidade"; break;
            case "Classe de Blindagem": case "Armor Class": targetKey = "ClasseBlindagem"; break;
            case "Penalidade de Movimento": case "Movement Speed": targetKey = "PenalidadeMovimento"; break;
            case "Ergonomia": case "Ergonomics": targetKey = "Ergonomia"; break;
            case "Classe Máxima da Máscara Compatível": case "Max Mask Class": targetKey = "ClMaxMasc"; break;
            case "Área Protegida": case "Protected Area": targetKey = "AreaProtegida"; break;
            case "Captura de Som": case "Sound Pickup": targetKey = "CaptacaoSom"; break;
        }
    }
    else if (currentSearchMode === 'masks') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Durabilidade": case "Durability": targetKey = "Durabilidade"; break;
            case "Classe de Blindagem": case "Armor Class": targetKey = "ClasseBlindagem"; break;
            case "Chance de Ricochete": case "Ricochet Chance": targetKey = "Ricochete"; break;
        }
    }
    else if (currentSearchMode === 'gasMasks') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Durabilidade": case "Durability": targetKey = "Durabilidade"; break;
            case "Anti-Veneno": case "Anti-Poison": targetKey = "AntiVeneno"; break;
            case "Anti-Flash": case "Anti-Flash": targetKey = "AntiFlash"; break;
        }
    }
    else if (currentSearchMode === 'headsets') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Captação de Som": case "Captador de Som": case "Sound Pickup": targetKey = "CaptacaoSom"; break;
            case "Redução de Ruído": case "Noise Reduction": targetKey = "ReducaoRuido"; break;
        }
    }
    else if (currentSearchMode === 'bodyArmor') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Durabilidade": case "Durability": targetKey = "Durabilidade"; break;
            case "Classe de Blindagem": case "Armor Class": targetKey = "ClasseBlindagem"; break;
            case "Material": case "Material": targetKey = "Material"; break;
            case "Penalidade de Movimento": case "Movement Speed": targetKey = "PenalidadeMovimento"; break;
            case "Ergonomia": case "Ergonomics": targetKey = "Ergonomia"; break;
            case "Área Protegida": case "Protected Area": targetKey = "AreaProtegida"; break;
        }
    }
    else if (currentSearchMode === 'armoredRigs') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Durabilidade": case "Durability": targetKey = "Durabilidade"; break;
            case "Classe de Blindagem": case "Armor Class": targetKey = "ClasseBlindagem"; break;
            case "Penalidade de Movimento": case "Movement Speed": targetKey = "PenalidadeMovimento"; break;
            case "Ergonomia": case "Ergonomics": targetKey = "Ergonomia"; break;
            case "Armazenamento": case "Storage Space": targetKey = "EspacoArmazenamento"; break;
            case "Área Protegida": case "Protected Area": targetKey = "AreaProtegida"; break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)": targetKey = "LayoutInterno"; break;
        }
    }
    else if (currentSearchMode === 'unarmoredRigs') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Armazenamento": case "Storage Space": targetKey = "EspacoTotal"; break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)": targetKey = "LayoutInterno"; break;
            case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space": targetKey = "EficienciaDisplay"; break;
        }
    }
    else if (currentSearchMode === 'backpacks') {
        switch (selectedCriterion) {
            case "Peso": case "Weight": targetKey = "Peso"; break;
            case "Armazenamento": case "Storage Space": targetKey = "EspacoTotal"; break;
            case "Conjunto de Blocos (HxV)": case "Block set (HxV)": targetKey = "LayoutInterno"; break;
            case "+Espaço p/ Armaz. -Espaço Consumido": case "+Stor -Space": targetKey = "EficienciaDisplay"; break;
        }
    }
    else if (currentSearchMode.startsWith('medical_')) {
        if (currentSearchMode === 'medical_bandages' || currentSearchMode === 'medical_nebulizers') targetKey = "Usos";
        else if (currentSearchMode === 'medical_stimulants') targetKey = "EfeitoPrincipal";
        else if (currentSearchMode === 'medical_painkillers') {
            switch (selectedCriterion) {
                case "Usos": case "Uses": targetKey = "Usos"; break;
                case "Duração": case "Duration": targetKey = "Duracao"; break;
                case "Desidratação": case "Dehydration": targetKey = "Desidratacao"; break;
                case "Duração Máxima": case "Max Duration": targetKey = "DurMax"; break;
            }
        }
        else if (currentSearchMode === 'medical_surgical') {
            switch (selectedCriterion) {
                case "Usos": case "Uses": targetKey = "Usos"; break;
                case "Tempo de Atraso": case "Delay": targetKey = "Delay"; break;
                case "Desidratação": case "Dehydration": targetKey = "Desidratacao"; break;
                case "Recuperação por Uso": case "HP Recovery": targetKey = "RecuperacaoHP"; break;
                case "Espaço (HxV)": case "Space (HxV)": targetKey = "EspacoOcupado"; break;
            }
        }
        else if (currentSearchMode === 'medical_medkits') {
            switch (selectedCriterion) {
                case "Durabilidade": case "Durability": targetKey = "DurabilidadeTotal"; break;
                case "Desidratação": case "Dehydration": targetKey = "Desidratacao"; break;
                case "Velocidade de Cura": case "Healing Speed": targetKey = "VelocidadeCura"; break;
                case "Delay": case "Tempo de Atraso": targetKey = "Delay"; break;
                case "Espaço (HxV)": case "Space (HxV)": targetKey = "EspacoOcupado"; break;
                case "Durabilidade por Slot": case "Durability per Slot": targetKey = "DurabSlot"; break;
            }
        }
    }
    else if (currentSearchMode.startsWith('food_')) {
        switch (selectedCriterion) {
            case "Hidratação": case "Hydration": targetKey = "Hidratacao"; break;
            case "Energia": case "Energy": targetKey = "Energia"; break;
            case "Hidratação por Slot": case "Hydration per Slot": targetKey = "HidratSlot"; break;
            case "Energia por Slot": case "Energy per Slot": targetKey = "EnergSlot"; break;
        }
    }

    const trHead = document.createElement('tr');
    config.columns.forEach(colDef => {
        const th = document.createElement('th');
        th.textContent = colDef.label;
        th.style.cursor = 'default'; 
        
        if (colDef.tooltip) {
            th.title = colDef.tooltip;
        }
        
        if (colDef.key === targetKey) {
            th.style.color = "var(--orange-accent)"; 
            th.style.fontWeight = "bold";
        }

        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    displayData.forEach(row => {
        const tr = document.createElement('tr');
        
        config.columns.forEach(colDef => {
            const td = document.createElement('td');
            let rawValue = row[colDef.key];

            if (colDef.isTime) {
                td.textContent = formatTime(rawValue);
            }
            else if (currentLang !== 'en') {
                td.textContent = traduzirDado(currentSearchMode, colDef.key, rawValue);
            } 
            else {
                td.textContent = rawValue !== undefined ? rawValue : "";
            }

            const tooltipDinamico = getCellTooltip(colDef.key, rawValue);
            
            if (tooltipDinamico) {
                td.setAttribute('title', tooltipDinamico);
                td.classList.add('has-dynamic-tooltip'); 
            }

            if (colDef.key === targetKey) {
                td.style.color = "var(--orange-accent)";
                td.style.fontWeight = "bold";
            }

            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    
    const tableContainer = document.getElementById('table-body').closest('div');
    if (tableContainer) {
        tableContainer.scrollTop = 0;
    }
}

// =====================================================================
// EXPORTAÇÃO DE IMAGEM (SCREENSHOT DE ALTA QUALIDADE E ALTURA INFINITA)
// =====================================================================
async function exportarComoImagem(elementoID, nomeBaseArquivo) {
    const elemento = document.getElementById(elementoID);
    if (!elemento) return;
    
    // --- PUXA O DICIONÁRIO NO INÍCIO DA FUNÇÃO ---
    const t = translations[currentLang];

    // --- LINHA NOVA 1: Aciona o CSS global que esconde os botões .hide-on-export ---
    elemento.classList.add('exporting-mode');

    // 1. Esconde os botões e painéis de controle da foto
    const headerControls = elemento.querySelector('.header-controls');
    const filtersArea = elemento.querySelector('.controls > div:nth-child(2)');
    // Também procura os controles da tela de comparação, se for o caso
    const compControls = elemento.querySelector('.controls'); 
    
    if (headerControls) headerControls.style.display = 'none';
    if (filtersArea) filtersArea.style.display = 'none';
    
    // Se for a tela de comparação, os controles já incluem o título, e nós escondemos todos os botões
    if (elementoID === 'compare-results-view' && compControls) {
         const btnArea = compControls.querySelector('div:last-child');
         if(btnArea) btnArea.style.display = 'none';
    }

    // --- NOVO: Se for a tela de Gráfico de Dano, esconde controles, slots, dica e BOTÕES DE REMOVER ---
    if (elementoID === 'damage-section') {
         if (compControls) compControls.style.display = 'none';
         
         // MÁGICA 1: Oculta temporariamente todas as linhas que têm o crachá de vazias
         const emptySlots = elemento.querySelectorAll('.dmg-empty-slot');
         emptySlots.forEach(slot => slot.style.display = 'none');
         
         // MÁGICA 2: Oculta a Instrução Flutuante do Gráfico
         const chartInstruction = document.getElementById('dmg-chart-instruction');
         if (chartInstruction) chartInstruction.style.display = 'none';
         
         // MÁGICA 3: Oculta os botões de Remover ("X") da tabela
         const removeBtns = elemento.querySelectorAll('#dmg-data-table button');
         removeBtns.forEach(btn => btn.style.display = 'none');
    }

    // --- A GRANDE MUDANÇA (FOCO EXCLUSIVO): 
    // Define um "Alvo Focado" para a câmera. Por padrão é a tela inteira, mas para o Simulador, será apenas a caixa do relatório!
    let targetNode = elemento; 

    // --- NOVO: Se for a tela do Simulador Balístico, esconde os dropdowns e o botão ---
    let simDropdownPanel = null;
    let simExportBtn = null;
    if (elementoID === 'simulator-section') {
         const allControls = elemento.querySelectorAll('.controls');
         if (allControls.length > 1) {
             simDropdownPanel = allControls[1]; // O painel dos 4 dropdowns
             simDropdownPanel.style.display = 'none';
         }
         simExportBtn = elemento.querySelector('#btn-sim-export');
         if (simExportBtn) simExportBtn.style.display = 'none';
         
         // Foca a Câmera exclusivamente no Relatório (Ignorando os espaços vazios laterais da tela mãe)
         const resContainer = document.getElementById('sim-result-container');
         if (resContainer && resContainer.style.display !== 'none') {
             targetNode = resContainer;
         }
    }

    // =====================================================
    // INJEÇÃO DO TÍTULO DO RELATÓRIO (NO TOPO)
    // =====================================================
    let relatorioTitulo = null;
    
    // Adiciona o título na tela de Busca
    if (elementoID === 'search-data-view') {
        let textoTitulo = "";

        // Se for aba Farmacêutica, pega o nome direto da caixa de seleção ativa
        if (currentSearchMode.startsWith('medical_')) {
            const medSelect = document.getElementById('medical-subcategory-select');
            if (medSelect && medSelect.selectedIndex !== -1) {
                textoTitulo = medSelect.options[medSelect.selectedIndex].text;
            }
        } 
        // Se for aba Gastronômica, pega o nome direto da caixa de seleção ativa
        else if (currentSearchMode.startsWith('food_')) {
            const foodSelect = document.getElementById('food-subcategory-select');
            if (foodSelect && foodSelect.selectedIndex !== -1) {
                textoTitulo = foodSelect.options[foodSelect.selectedIndex].text;
            }
        }

        // Se não for nenhuma das duas (Armas, Capacetes, etc), pega o título geral do painel
        if (!textoTitulo) {
            const tituloElemento = document.getElementById('current-category-title');
            // MUDANÇA A AQUI: Puxa direto do dicionário (t)
            textoTitulo = tituloElemento ? tituloElemento.textContent : t.msgItemsReport;
        }
        
        textoTitulo = textoTitulo
            .replace(/^Busca de /i, '')
            .replace(/^Busca /i, '')
            .replace(/ Search$/i, '')
            .replace(/^Search /i, '');
            
        textoTitulo = textoTitulo.charAt(0).toUpperCase() + textoTitulo.slice(1);
            
        // Pega a contagem de itens
        const lblCountElement = document.getElementById('lbl-count');
        let textoContagem = lblCountElement ? lblCountElement.textContent : "";

        relatorioTitulo = document.createElement('div');
        relatorioTitulo.style.textAlign = 'center';
        relatorioTitulo.style.padding = '20px';
        relatorioTitulo.style.marginBottom = '15px';
        relatorioTitulo.style.backgroundColor = 'var(--panel-back)';
        relatorioTitulo.style.borderBottom = '2px solid var(--orange-accent)';
        relatorioTitulo.style.borderTopLeftRadius = '8px';
        relatorioTitulo.style.borderTopRightRadius = '8px';
        
        relatorioTitulo.innerHTML = `
            <h1 style="color: var(--orange-accent); margin: 0; font-size: 2.2rem; letter-spacing: 1px;">
                ${textoTitulo}
            </h1>
            <p style="color: var(--text-dim); margin-top: 5px; font-size: 1.1rem; font-style: italic;">
                ${textoContagem}
            </p>
        `;
        
        targetNode.insertBefore(relatorioTitulo, targetNode.firstChild);
    } 
    // --- NOVO: Adiciona o título cortado da tela principal para o topo do relatório do Simulador ---
    else if (elementoID === 'simulator-section' && targetNode !== elemento) {
        const mainTitle = document.getElementById('title-simulator');
        relatorioTitulo = document.createElement('div');
        relatorioTitulo.style.textAlign = 'center';
        relatorioTitulo.style.padding = '15px 20px';
        relatorioTitulo.style.marginBottom = '20px'; // Espaçamento pro cabeçalho "Análise de Penetração"
        relatorioTitulo.style.backgroundColor = 'var(--panel-back)';
        relatorioTitulo.style.borderBottom = '2px solid var(--orange-accent)';
        relatorioTitulo.style.borderRadius = '8px';
        
        relatorioTitulo.innerHTML = `
            <h1 style="color: var(--orange-accent); margin: 0; font-size: 2.2rem; letter-spacing: 1px;">
                ${mainTitle ? mainTitle.textContent : "Simulador Balístico"}
            </h1>
        `;
        // Insere o título no topo do container de resultados isolado!
        targetNode.insertBefore(relatorioTitulo, targetNode.firstChild);
    }
    // =====================================================

    // =====================================================
    // INJEÇÃO DA ASSINATURA DO AUTOR (FANTASMA E BILÍNGUE)
    // =====================================================
    const marcaDagua = document.createElement('div');
    marcaDagua.style.textAlign = 'right';
    marcaDagua.style.padding = '15px 25px';
    marcaDagua.style.marginTop = '10px';
    marcaDagua.style.fontSize = '1.1rem';
    marcaDagua.style.fontWeight = 'bold';
    marcaDagua.style.color = 'var(--text-dim)';
    marcaDagua.style.borderTop = '1px dashed var(--button-back)';
    
    // MUDANÇA B AQUI: Puxa direto do dicionário
    const textoDesenvolvido = t.msgDevelopedBy;
    
    marcaDagua.innerHTML = `ABIDB Web &bull; ${textoDesenvolvido} <span style="color: var(--orange-accent);">Fabiopsyduck</span> (GitHub)`;
    
    // Injeta a assinatura DENTRO da câmera focada
    targetNode.appendChild(marcaDagua);
    // =====================================================

    // 2. Localiza as barreiras arquitetônicas que cortam a foto
    const appContainer = document.getElementById('app-container');
    const contentArea = document.getElementById('content-area');
    const gridArea = elemento.querySelector('.grid-area');
    const ammoBlocks = elemento.querySelectorAll('.res-ammo-block'); 

    const originalStyles = {
        bodyOverflow: document.body.style.overflow,
        bodyHeight: document.body.style.height,
        bodyZoom: document.body.style.zoom, 
        appHeight: appContainer ? appContainer.style.height : '',
        appOverflow: appContainer ? appContainer.style.overflow : '',
        contentOverflow: contentArea ? contentArea.style.overflow : '',
        contentHeight: contentArea ? contentArea.style.height : '',
        elemOverflow: elemento.style.overflow,
        elemHeight: elemento.style.height,
        gridOverflow: gridArea ? gridArea.style.overflow : '',
        gridMaxHeight: gridArea ? gridArea.style.maxHeight : '',
        gridHeight: gridArea ? gridArea.style.height : ''
    };

    // 3. Rola a tabela para o topo
    window.scrollTo(0, 0);
    if (gridArea) gridArea.scrollTop = 0;

    // 4. Quebra todas as correntes de limite de altura E REMOVE O ZOOM!
    document.body.style.overflow = 'visible';
    document.body.style.height = 'auto';
    document.body.style.zoom = '1'; 

    if (appContainer) { appContainer.style.height = 'auto'; appContainer.style.overflow = 'visible'; }
    if (contentArea) { contentArea.style.height = 'auto'; contentArea.style.overflow = 'visible'; }
    
    elemento.style.height = 'auto';
    elemento.style.overflow = 'visible';
    
    if (gridArea) {
        gridArea.style.overflow = 'visible';
        gridArea.style.maxHeight = 'none';
        gridArea.style.height = 'auto';
    }

    ammoBlocks.forEach(block => {
        block.style.maxHeight = 'none';
        block.style.overflow = 'visible';
    });

    const btn = document.getElementById('btn-comp-export') || document.getElementById('btn-export-image') || document.getElementById('btn-dmg-export') || document.getElementById('btn-sim-export');
    
    // MUDANÇA C AQUI: Puxa direto do dicionário
    const textoOriginal = btn ? btn.innerHTML : t.msgExportResults;
    if (btn) { btn.innerHTML = t.msgExporting; btn.disabled = true; }

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        // 5. AQUI É ONDE A MÁGICA ACONTECE! Tiramos a foto do 'targetNode' exato, que tem o recorte perfeito.
        const canvas = await html2canvas(targetNode, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#1e1e1e',
            logging: false,
            windowWidth: targetNode.scrollWidth, 
            windowHeight: Math.max(targetNode.scrollHeight, document.body.scrollHeight)
        });

        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        
        const dataStr = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
        let categoriaNome = currentSearchMode || "Tabela";
        
        if (elementoID === 'mask-comp-section') categoriaNome = "Comp_Mascaras";
        // Garante o nome correto no arquivo salvo
        if (elementoID === 'simulator-section') categoriaNome = "Relatorio_Balistico";
        
        link.download = `${nomeBaseArquivo}_${categoriaNome}_${dataStr}.png`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (err) {
        console.error("Erro ao gerar imagem:", err);
        // MUDANÇA D AQUI: Puxa direto do dicionário
        const msgErro = t.msgExportError;
        
        showCustomToast(msgErro); 
    } finally {
        // 7. Limpeza e Restauração
        elemento.classList.remove('exporting-mode');

        if (headerControls) headerControls.style.display = '';
        if (filtersArea) filtersArea.style.display = '';
        if (elementoID === 'compare-results-view' && compControls) {
             const btnArea = compControls.querySelector('div:last-child');
             if(btnArea) btnArea.style.display = '';
        }

        if (elementoID === 'damage-section') {
             if (compControls) compControls.style.display = '';
             const emptySlots = elemento.querySelectorAll('.dmg-empty-slot');
             emptySlots.forEach(slot => slot.style.display = '');
             const chartInstruction = document.getElementById('dmg-chart-instruction');
             if (chartInstruction) chartInstruction.style.display = '';
             const removeBtns = elemento.querySelectorAll('#dmg-data-table button');
             removeBtns.forEach(btn => btn.style.display = '');
        }

        // Restaura os controles do Simulador Balístico na tela
        if (elementoID === 'simulator-section') {
             if (simDropdownPanel) simDropdownPanel.style.display = 'flex'; 
             if (simExportBtn) simExportBtn.style.display = '';
        }

        if (relatorioTitulo && relatorioTitulo.parentNode) {
            relatorioTitulo.parentNode.removeChild(relatorioTitulo);
        }

        if (marcaDagua && marcaDagua.parentNode) {
            marcaDagua.parentNode.removeChild(marcaDagua);
        }

        document.body.style.overflow = originalStyles.bodyOverflow;
        document.body.style.height = originalStyles.bodyHeight;
        document.body.style.zoom = originalStyles.bodyZoom || ''; 

        if (appContainer) { appContainer.style.height = originalStyles.appHeight; appContainer.style.overflow = originalStyles.appOverflow; }
        if (contentArea) { contentArea.style.height = originalStyles.contentHeight; contentArea.style.overflow = originalStyles.contentOverflow; }
        
        elemento.style.height = originalStyles.elemHeight;
        elemento.style.overflow = originalStyles.elemOverflow;

        if (gridArea) {
            gridArea.style.overflow = originalStyles.gridOverflow;
            gridArea.style.maxHeight = originalStyles.gridMaxHeight;
            gridArea.style.height = originalStyles.gridHeight;
        }

        ammoBlocks.forEach(block => {
            block.style.maxHeight = '';
            block.style.overflow = '';
        });

        if (btn) { btn.innerHTML = textoOriginal; btn.disabled = false; }
    }
}

// =====================================================================
// MOTOR DA VITRINE E CARRINHO (COMPARAÇÃO DE ARMAS COM INTERSECÇÃO AVANÇADA)
// =====================================================================

let compSelectedWeapons = []; // "Carrinho de compras" (guarda os nomes das armas selecionadas)
let compFiltersActive = {};   // Guarda os filtros clicados MANUALMENTE pelo usuário (Estado Laranja)
let isCompInitialized = false;

// 1. INICIALIZAÇÃO DA TELA DE COMPARAÇÃO
function initCompareShowcase() {
    if (isCompInitialized) return;
    
    // Inicia o estado vazio de todos os filtros (incluindo Munição)
    compFiltersActive = {
        "Calibre": [],
        "ModoDisparoDisplay": [],
        "PoderFogoDisplay": [],
        "CanoDisplay": [],
        "NivelPenetracao": [],
        "ChanceFerirDisplay": []
    };
    
    updateCompEngine(); // Roda o motor pela primeira vez
    isCompInitialized = true;
}

// 2. FORMATADORES DE DADOS (Injetam os valores PT/EN para o motor comparar)
function formatWeaponsForComp() {
    return db.weapons.map(row => {
        let n = { ...row };
        if (currentLang !== 'en') {
            n.ModoDisparoDisplay = traduzirDado('weapons', 'ModoDisparo', n.ModoDisparo);
            n.PoderFogoDisplay = traduzirDado('weapons', 'PoderFogo', n.PoderFogo);
            n.CanoDisplay = traduzirDado('weapons', 'TipoCano', n.TipoCano);
            n.ClasseDisplay = traduzirDado('weapons', 'Classe', n.Classe);
        } else {
            n.ModoDisparoDisplay = n.ModoDisparo;
            n.PoderFogoDisplay = n.PoderFogo;
            n.CanoDisplay = n.TipoCano;
            n.ClasseDisplay = n.Classe;
        }
        return n;
    });
}

function formatAmmoForComp() {
    return db.ammo.map(row => {
        let n = { ...row };
        n.NivelPenetracao = String(n.NivelPenetracao || "0"); 
        
        let chanceVal = n.ChanceFerir; 
        if (!chanceVal || chanceVal === "/////") chanceVal = "//////";
        n.ChanceFerirDisplay = currentLang !== 'en' ? traduzirDado('ammo', 'ChanceFerir', chanceVal) : chanceVal;
        
        return n;
    });
}

// 3. O MOTOR MATEMÁTICO (O Coração do $UpdateUI)
// Esta função calcula o cruzamento de calibres e redesenha Filtros e Colunas
function updateCompEngine() {
    const wepsData = formatWeaponsForComp();
    const ammoData = formatAmmoForComp();
    
    // --- LÓGICA CORE (Baseada no $UpdateUI do PowerShell) ---
    
    // PASSO A: O que o usuário permitiu? (O que NÃO está na lista de banimento)
    const validLevels = Array.from(new Set(ammoData.map(a => a.NivelPenetracao))).filter(v => !compFiltersActive["NivelPenetracao"].includes(v));
    const validChances = Array.from(new Set(ammoData.map(a => a.ChanceFerirDisplay))).filter(v => !compFiltersActive["ChanceFerirDisplay"].includes(v));
    const validMods = Array.from(new Set(wepsData.map(w => w.ModoDisparoDisplay))).filter(v => !compFiltersActive["ModoDisparoDisplay"].includes(v));
    const validPods = Array.from(new Set(wepsData.map(w => w.PoderFogoDisplay))).filter(v => !compFiltersActive["PoderFogoDisplay"].includes(v));
    const validCans = Array.from(new Set(wepsData.map(w => w.CanoDisplay))).filter(v => !compFiltersActive["CanoDisplay"].includes(v));
    
    // Os calibres possíveis no mundo inteiro, tirando os que o usuário baniu explicitamente
    const allCalsSet = new Set([...ammoData.map(a=>a.Calibre), ...wepsData.map(w=>w.Calibre)]);
    const userValidCalibers = Array.from(allCalsSet).filter(c => !compFiltersActive["Calibre"].includes(c));

    // PASSO B: Filtra Munição pelas propriedades EXCLUSIVAS de munição
    const filteredAmmo = ammoData.filter(a => validLevels.includes(a.NivelPenetracao) && validChances.includes(a.ChanceFerirDisplay));
    const calsFromAmmo = new Set(filteredAmmo.map(a => a.Calibre));

    // PASSO C: Filtra Armas pelas propriedades EXCLUSIVAS de arma
    const filteredWeps = wepsData.filter(w => validMods.includes(w.ModoDisparoDisplay) && validPods.includes(w.PoderFogoDisplay) && validCans.includes(w.CanoDisplay));
    const calsFromWeps = new Set(filteredWeps.map(w => w.Calibre));

    // PASSO D: O Ponto de Encontro (Intersecção Bidirecional dos Calibres)
    const trueSurvivingCalibers = userValidCalibers.filter(c => calsFromAmmo.has(c) && calsFromWeps.has(c));

    // PASSO E: Corta os sobreviventes finais usando a lista oficial de calibres
    const survivingWeapons = filteredWeps.filter(w => trueSurvivingCalibers.includes(w.Calibre));
    const survivingAmmo = filteredAmmo.filter(a => trueSurvivingCalibers.includes(a.Calibre));

    // PASSO F: Mapeia o que sobrou para definir o que fica CINZA (Auto-Excluído)
    const liveMap = {
        "Calibre": trueSurvivingCalibers,
        "ModoDisparoDisplay": Array.from(new Set(survivingWeapons.map(w => w.ModoDisparoDisplay))),
        "PoderFogoDisplay": Array.from(new Set(survivingWeapons.map(w => w.PoderFogoDisplay))),
        "CanoDisplay": Array.from(new Set(survivingWeapons.map(w => w.CanoDisplay))),
        "NivelPenetracao": Array.from(new Set(survivingAmmo.map(a => a.NivelPenetracao))),
        "ChanceFerirDisplay": Array.from(new Set(survivingAmmo.map(a => a.ChanceFerirDisplay)))
    };

    // Agora desenha tudo na tela baseado nos resultados
    renderCompFiltersUI(liveMap, wepsData, ammoData);
    renderCompShowcaseUI(survivingWeapons, wepsData);
}

// 4. RENDERIZA OS FILTROS HORIZONTAIS
function renderCompFiltersUI(liveMap, wepsData, ammoData) {
    const container = document.getElementById('comp-filters-container');
    if (!container) return;
    
    container.innerHTML = '';
    const wConfig = getFilterConfig('weapons');
    const aConfig = getFilterConfig('ammo');
    const t = translations[currentLang];
    
    const filterDefs = [
        { prop: "Calibre", title: t.compResAttributes.cal, source: "weapons_ammo", order: wConfig.definitions.find(d => d.prop === 'Calibre').customOrder },
        { prop: "ModoDisparoDisplay", title: t.compResAttributes.fire, source: "weapons", order: wConfig.definitions.find(d => d.prop === 'ModoDisparoDisplay').customOrder },
        { prop: "PoderFogoDisplay", title: t.compResAttributes.power, source: "weapons", order: wConfig.definitions.find(d => d.prop === 'PoderFogoDisplay').customOrder },
        { prop: "CanoDisplay", title: t.compResAttributes.barrel, source: "weapons", order: wConfig.definitions.find(d => d.prop === 'CanoDisplay').customOrder },
        
        { prop: "NivelPenetracao", title: t.lblFilterPen, source: "ammo", order: null },
        { prop: "ChanceFerirDisplay", title: t.lblFilterWound, source: "ammo", order: aConfig.definitions.find(d => d.prop === 'ChanceFerirDisplay').customOrder }
    ];

    filterDefs.forEach(def => {
        const block = document.createElement('div');
        block.className = 'comp-filter-block';
        
        if (def.prop === "NivelPenetracao") {
            block.style.marginLeft = "30px"; 
        }
        
        if (def.source === 'ammo') {
            block.style.borderColor = "var(--text-dim)";
        }

        const title = document.createElement('div');
        title.className = 'comp-filter-title';
        title.textContent = def.title;
        
        if (def.source === 'ammo') {
            title.style.backgroundColor = "rgba(160, 160, 160, 0.15)";
        }

        const listContainer = document.createElement('div');
        listContainer.className = 'comp-filter-list';
        
        let rawValuesSet = new Set();
        if (def.source === 'weapons' || def.source === 'weapons_ammo') wepsData.forEach(w => { if (w[def.prop]) rawValuesSet.add(String(w[def.prop])); });
        if (def.source === 'ammo' || def.source === 'weapons_ammo') ammoData.forEach(a => { if (a[def.prop]) rawValuesSet.add(String(a[def.prop])); });
        
        let rawValues = Array.from(rawValuesSet);
        let orderedValues = [];
        
        if (def.order) {
            def.order.forEach(item => { if (rawValues.includes(item)) orderedValues.push(item); });
            rawValues.forEach(rv => { if (!orderedValues.includes(rv)) orderedValues.push(rv); });
        } else {
            orderedValues = rawValues.sort((a,b) => {
                let numA = parseFloat(a); let numB = parseFloat(b);
                if(!isNaN(numA) && !isNaN(numB)) return numA - numB;
                return a.localeCompare(b);
            });
        }
        
        orderedValues.forEach(val => {
            if (val.trim() === "" || val === "/////" || val === "//////") return;
            
            const label = document.createElement('label');
            label.className = 'filter-checkbox-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            
            // --- INÍCIO DA LÓGICA DO TOOLTIP DE CANO NO FILTRO ---
            if (def.prop === "CanoDisplay") {
                let rawVal = val;
                if (currentLang !== 'en') {
                    const dicCano = translations[currentLang].dataDict?.weapons?.TipoCano;
                    if (dicCano) {
                        const foundKey = Object.keys(dicCano).find(k => dicCano[k] === val);
                        if (foundKey) rawVal = foundKey;
                    }
                }
                const tooltipText = translations[currentLang].tooltipBarrel ? translations[currentLang].tooltipBarrel[rawVal] : null;
                if (tooltipText) {
                    label.title = tooltipText;
                    label.classList.add('has-dynamic-tooltip');
                }
            }

            if (compFiltersActive[def.prop].includes(val)) {
                label.classList.add('state-M'); 
                checkbox.checked = true;
                checkbox.disabled = false;
            } else if (!liveMap[def.prop].includes(val)) {
                label.classList.add('state-A'); 
                checkbox.checked = true; 
                checkbox.disabled = true; 
            } else {
                label.classList.add('state-F'); 
                checkbox.checked = false;
                checkbox.disabled = false;
            }
            
            checkbox.addEventListener('change', () => {
                if (checkbox.disabled) return;
                if (checkbox.checked) {
                    compFiltersActive[def.prop].push(val);
                } else {
                    compFiltersActive[def.prop] = compFiltersActive[def.prop].filter(v => v !== val);
                }
                updateCompEngine(); 
            });
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + val));
            listContainer.appendChild(label);
        });
        
        block.appendChild(title);
        block.appendChild(listContainer);
        container.appendChild(block);
    }); 

    let avisoAntigo = document.getElementById('comp-ammo-warning-box');
    if (avisoAntigo) avisoAntigo.remove();

    const avisoDiv = document.createElement('div');
    avisoDiv.id = 'comp-ammo-warning-box';
    avisoDiv.style.width = '100%'; 
    avisoDiv.style.marginTop = '13px'; /* Matemática 64% */
    avisoDiv.style.padding = '8px 10px'; /* Matemática 64% */
    avisoDiv.style.backgroundColor = 'rgba(255, 165, 0, 0.05)'; 
    avisoDiv.style.borderLeft = '4px solid var(--orange-accent)'; 
    avisoDiv.style.fontSize = '0.58rem'; /* Matemática 64% */
    avisoDiv.style.color = 'var(--text-dim)';
    avisoDiv.style.lineHeight = '1.5';

    avisoDiv.innerHTML = t.compAmmoWarning;
    container.parentNode.insertBefore(avisoDiv, container.nextSibling);
}

// 5. RENDERIZA AS 8 COLUNAS DA VITRINE
function renderCompShowcaseUI(finalSurvivingWeapons, wepsData) {
    const showcase = document.getElementById('comp-weapons-showcase');
    if (!showcase) return;
    
    showcase.innerHTML = '';
    
    const classesOrdered = [
        "ASSAULT RIFLE", "SUBMACHINE GUN", "CARBINE", "MARKSMAN RIFLE", 
        "BOLT-ACTION RIFLE", "SHOTGUN", "LIGHT MACHINE GUN", "PISTOL"
    ];

    wepsData.sort((a, b) => a.NomeItem.localeCompare(b.NomeItem));

    classesOrdered.forEach(cls => {
        const armasDaClasse = wepsData.filter(w => w.Classe === cls);
        if (armasDaClasse.length === 0) return;
        
        const armasVisiveis = armasDaClasse.filter(w => 
            !compSelectedWeapons.includes(w.NomeItem) && 
            finalSurvivingWeapons.some(fw => fw.NomeItem === w.NomeItem)
        );

        if (armasVisiveis.length > 0) {
            const col = document.createElement('div');
            col.className = 'comp-column';
            
            const title = document.createElement('div');
            title.className = 'comp-column-title';
            title.textContent = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', cls) : cls;
            
            const list = document.createElement('div');
            list.className = 'comp-column-list';
            
            armasVisiveis.forEach(w => {
                const btn = document.createElement('button');
                btn.className = 'comp-weapon-btn';
                btn.style.display = 'flex';
                btn.style.justifyContent = 'space-between';
                btn.style.alignItems = 'center';
                btn.style.gap = '8px'; /* Matemática 64% (Era 12px) */
                btn.style.textAlign = 'left';
                btn.style.height = 'auto'; 
                btn.style.minHeight = '18px'; /* Matemática 64% (Era 28px) */
                btn.style.padding = '3px 5px'; /* Matemática 64% (Era 4px 8px) */
                
                btn.innerHTML = `
                    <span style="flex-grow: 1; word-break: break-word; line-height: 1.1; font-size: 0.95em;">${w.NomeItem}</span>
                    <span style="white-space: nowrap; font-size: 0.8em; opacity: 0.65;">${w.Calibre}</span>
                `;
                
                btn.onclick = () => addToCompCart(w.NomeItem);
                list.appendChild(btn);
            });
            
            col.appendChild(title);
            col.appendChild(list);
            showcase.appendChild(col);
        }
    });
    
    updateCompCartUI();
}

// 6. FUNÇÕES DE CONTROLE DO CARRINHO (Botões de Ação)
function addToCompCart(wepName) {
    if (compSelectedWeapons.length >= 15) {
        const t = translations[currentLang];
        showCustomToast(t.msgLimitWeapons); 
        return;
    }
    if (!compSelectedWeapons.includes(wepName)) {
        compSelectedWeapons.push(wepName);
        updateCompEngine(); 
    }
}

function removeFromCompCart(wepName) {
    compSelectedWeapons = compSelectedWeapons.filter(n => n !== wepName);
    updateCompEngine(); 
}

function clearAllCompSelections() {
    compSelectedWeapons = [];
    updateCompEngine();
}

function resetCompFilters() {
    Object.keys(compFiltersActive).forEach(k => compFiltersActive[k] = []);
    updateCompEngine(); // Desmarca e recalcula tudo
}

// =====================================================================
// INTERFACE DO CARRINHO (COM ANIMAÇÕES FLIP DE ENTRADA E SAÍDA)
// =====================================================================
function updateCompCartUI() {
    const listDiv = document.getElementById('comp-selected-list');
    const lblCount = document.getElementById('comp-selected-count');
    const lblEmpty = document.getElementById('lbl-comp-empty');
    const btnCompare = document.getElementById('btn-comp-compare');
    if (!listDiv || !lblCount) return;
    
    lblCount.textContent = compSelectedWeapons.length;
    
    if (compSelectedWeapons.length >= 2) {
        btnCompare.disabled = false;
        btnCompare.style.cursor = 'pointer';
        btnCompare.style.opacity = '1';
    } else {
        btnCompare.disabled = true;
        btnCompare.style.cursor = 'not-allowed';
        btnCompare.style.opacity = '0.5';
    }
    
    // --- INÍCIO DA ANIMAÇÃO (FLIP) ---
    // 1. Tira uma "foto" de onde as armas estão agora, antes de atualizar a lista
    const oldPositions = new Map();
    Array.from(listDiv.querySelectorAll('.comp-chip')).forEach(chip => {
        oldPositions.set(chip.dataset.name, chip.getBoundingClientRect().top);
    });
    
    // Apaga a lista HTML antiga
    Array.from(listDiv.children).forEach(child => {
        if (child.id !== 'lbl-comp-empty') child.remove();
    });
    
    listDiv.style.position = 'relative'; 
    
    if (compSelectedWeapons.length === 0) {
        if (lblEmpty) lblEmpty.style.display = 'block';
    } else {
        if (lblEmpty) lblEmpty.style.display = 'none';
        
        // Reconstrói a lista HTML atualizada
        compSelectedWeapons.forEach(wName => {
            const chip = document.createElement('div');
            chip.className = 'comp-chip';
            chip.dataset.name = wName;
            
            const txt = document.createElement('span');
            txt.textContent = wName;
            txt.style.pointerEvents = 'none'; // Ignora cliques na letra
            
            const t = translations[currentLang];
            const btnClose = document.createElement('div');
            btnClose.className = 'comp-chip-close';
            btnClose.textContent = '✕';
            btnClose.title = t.btnRemoveCart;
            btnClose.onpointerdown = (e) => e.stopPropagation(); 
            btnClose.onclick = (e) => {
                e.stopPropagation(); 
                
                // MÁGICA 1: Animação de exclusão (esmaece e encolhe antes de deletar)
                chip.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
                chip.style.transform = 'scale(0.8)';
                chip.style.opacity = '0';
                
                setTimeout(() => {
                    removeFromCompCart(wName);
                }, 150); // Aguarda a arma sumir antes de acionar a matemática pesada
            };
            
            chip.appendChild(txt);
            chip.appendChild(btnClose);
            
            // Ativa o evento de clique/toque (início do trilho)
            chip.addEventListener('pointerdown', initDrag);
            
            listDiv.appendChild(chip);
        });
        
        // --- CONCLUSÃO DA ANIMAÇÃO (FLIP) ---
        // 2. Compara o Passado (foto) com o Presente para gerar o movimento
        Array.from(listDiv.querySelectorAll('.comp-chip')).forEach(chip => {
            const wName = chip.dataset.name;
            
            if (oldPositions.has(wName)) {
                // A arma já existia antes. Vamos ver se ela subiu ou desceu na lista
                const oldY = oldPositions.get(wName);
                const newY = chip.getBoundingClientRect().top;
                const distance = oldY - newY;
                
                if (distance !== 0) {
                    // Teleporta a arma para o passado invisivelmente
                    chip.style.transition = 'none';
                    chip.style.transform = `translateY(${distance}px)`;
                    
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            // Desliza da posição antiga para a nova (Preenchendo o vazio suavemente)
                            chip.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
                            chip.style.transform = 'translateY(0px)';
                            
                            setTimeout(() => {
                                chip.style.transition = '';
                                chip.style.transform = '';
                            }, 250);
                        });
                    });
                }
            } else {
                // MÁGICA 2: Se for uma arma NOVA entrando, faz ela aparecer com um "Pop-in"
                chip.style.opacity = '0';
                chip.style.transform = 'scale(0.8)';
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        chip.style.transition = 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        chip.style.opacity = '1';
                        chip.style.transform = 'scale(1)';
                        
                        setTimeout(() => {
                            chip.style.transition = '';
                            chip.style.transform = '';
                        }, 250);
                    });
                });
            }
        });
    }
}

// =======================================================
// O MOTOR FÍSICO DO "CARRINHO SOBRE TRILHOS" (Acelerado e Dinâmico)
// =======================================================
let draggingItem = null;
let dragPlaceholder = null;
let startY = 0;
let startTop = 0;
let currentScale = 1; // Guarda o nível de zoom ou escala da tela

function initDrag(e) {
    if (e.button !== 0 && e.type !== 'touchstart' && e.pointerType !== 'touch' && e.pointerType !== 'mouse') return;
    e.preventDefault(); 
    
    draggingItem = e.currentTarget;
    const listDiv = draggingItem.parentElement;
    
    // "Algema" o mouse ao elemento (impede engasgos se o movimento for brusco)
    if (e.pointerId !== undefined) {
        try { draggingItem.setPointerCapture(e.pointerId); } catch(err){}
    }
    
    const offsetHeight = draggingItem.offsetHeight;
    const offsetWidth = draggingItem.offsetWidth;
    const rect = draggingItem.getBoundingClientRect();
    
    // Calcula o Zoom real da interface
    currentScale = rect.height / offsetHeight;
    if (isNaN(currentScale) || currentScale === 0) currentScale = 1;
    
    // Cria o "buraco" tracejado
    dragPlaceholder = document.createElement('div');
    dragPlaceholder.className = 'comp-chip-placeholder';
    dragPlaceholder.style.height = `${offsetHeight}px`;
    dragPlaceholder.style.width = `${offsetWidth}px`;
    
    startTop = draggingItem.offsetTop; 
    startY = e.clientY;
    
    listDiv.insertBefore(dragPlaceholder, draggingItem);
    
    // Descola a arma original e transforma ela num bloco flutuante
    draggingItem.classList.add('dragging');
    draggingItem.style.position = 'absolute';
    draggingItem.style.zIndex = '1000';
    draggingItem.style.width = `${offsetWidth}px`;
    draggingItem.style.left = `${draggingItem.offsetLeft}px`; 
    draggingItem.style.top = `${startTop}px`;
    
    // Prepara a GPU para processar o movimento sem lag
    draggingItem.style.willChange = 'transform';
    draggingItem.style.transform = `translateY(0px)`;
    
    document.addEventListener('pointermove', onDragMove);
    document.addEventListener('pointerup', endDrag);
}

function onDragMove(e) {
    if (!draggingItem || !dragPlaceholder) return;
    e.preventDefault();
    
    // Calcula o quanto o mouse desceu ou subiu com a correção de Zoom
    let deltaY = (e.clientY - startY) / currentScale;
    
    // Os "Para-choques" do trilho verticais (impede a arma de sair da caixa)
    const listDiv = document.getElementById('comp-selected-list');
    const maxTop = listDiv.offsetHeight - draggingItem.offsetHeight;
    
    if (startTop + deltaY < 0) {
        deltaY = -startTop;
    } else if (startTop + deltaY > maxTop) {
        deltaY = maxTop - startTop;
    }
    
    // Movimenta a arma na Placa de Vídeo
    draggingItem.style.transform = `translateY(${deltaY}px)`;
    
    // Lógica para empurrar as outras armas
    const siblings = Array.from(listDiv.querySelectorAll('.comp-chip:not(.dragging)'));
    const draggingRect = draggingItem.getBoundingClientRect();
    const draggingCenter = draggingRect.top + (draggingRect.height / 2);
    
    let nextSibling = siblings.find(sibling => {
        const siblingRect = sibling.getBoundingClientRect();
        const siblingCenter = siblingRect.top + (siblingRect.height / 2);
        return draggingCenter < siblingCenter;
    });
    
    let currentNext = dragPlaceholder.nextElementSibling;
    if (currentNext === draggingItem) currentNext = draggingItem.nextElementSibling; 
    
    // Só faz a troca se o buraco realmente precisar mudar de lugar
    if (nextSibling !== currentNext) {
        // MÁGICA DE ABRIR CAMINHO (FLIP Animation)
        const firstPositions = new Map();
        siblings.forEach(s => firstPositions.set(s, s.getBoundingClientRect().top));
        
        if (nextSibling) {
            listDiv.insertBefore(dragPlaceholder, nextSibling);
        } else {
            listDiv.appendChild(dragPlaceholder);
        }
        
        siblings.forEach(s => {
            const firstY = firstPositions.get(s);
            const lastY = s.getBoundingClientRect().top;
            const distance = firstY - lastY; 
            
            if (distance !== 0) {
                s.style.transition = 'none';
                s.style.transform = `translateY(${distance}px)`;
                
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        s.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        s.style.transform = 'translateY(0px)';
                        
                        setTimeout(() => {
                            s.style.transition = '';
                            s.style.transform = '';
                        }, 250);
                    });
                });
            }
        });
    }
}

function endDrag(e) {
    if (!draggingItem || !dragPlaceholder) return;
    
    if (e && e.pointerId !== undefined) {
        try { draggingItem.releasePointerCapture(e.pointerId); } catch(err){}
    }
    
    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', endDrag);
    
    dragPlaceholder.parentNode.insertBefore(draggingItem, dragPlaceholder);
    dragPlaceholder.remove();
    dragPlaceholder = null;
    
    draggingItem.classList.remove('dragging');
    draggingItem.style.position = '';
    draggingItem.style.top = '';
    draggingItem.style.left = '';
    draggingItem.style.width = '';
    draggingItem.style.zIndex = '';
    draggingItem.style.transform = '';
    draggingItem.style.willChange = '';
    draggingItem = null;
    
    const listDiv = document.getElementById('comp-selected-list');
    const newOrder = Array.from(listDiv.querySelectorAll('.comp-chip')).map(chip => chip.dataset.name);
        
    if (JSON.stringify(compSelectedWeapons) !== JSON.stringify(newOrder)) {
        compSelectedWeapons = newOrder;
        updateCompEngine();
    }
}

// 7. NAVEGAÇÃO DE RESULTADOS (Espaço temporário para a próxima etapa)
function backToCompSelection() {
    document.getElementById('compare-results-view').classList.add('hidden-section');
    document.getElementById('compare-selection-view').classList.remove('hidden-section');
}

// =====================================================================
// MOTOR DA TABELA DE COMPARAÇÃO FINAL (RESULTADOS EM COLUNAS E TABELAS)
// =====================================================================

// Escuta o clique do botão "Comparar Armas Selecionadas"
document.getElementById('btn-comp-compare').addEventListener('click', generateComparisonTable);

function generateComparisonTable() {
    const t = translations[currentLang]; // Puxa o Dicionário inteiro
    
    document.getElementById('compare-selection-view').classList.add('hidden-section');
    document.getElementById('compare-results-view').classList.remove('hidden-section');
    
    // Alvo: O painel pai. Limpa tudo
    const container = document.getElementById('comp-results-container');
    container.innerHTML = ''; 
    container.style.padding = '13px'; /* Matemática 64% */

    // --- NOVO MOTOR MATEMÁTICO: Quebra a string "48(60) | 34(63)" ---
    function parseDamageString(rawStr) {
        if (!rawStr || rawStr === "/////") return [];
        let pairs = rawStr.split('|').map(s => s.trim());
        let plotData = [];
        pairs.forEach(p => {
            let match = p.match(/^(\d+)\((\d+)\)$/);
            if (match) {
                plotData.push({ dano: parseInt(match[1], 10), alcance: parseInt(match[2], 10) });
            }
        });
        // Se tem apenas 1 ponto, aplica a regra de queda de -30% e +3m (Simulação Balística)
        if (plotData.length === 1) {
            let danoFinalBruto = plotData[0].dano * 0.70;
            let danoFinal = Math.round(danoFinalBruto);
            plotData.push({ dano: danoFinal, alcance: plotData[0].alcance + 3 });
        }
        return plotData;
    }
    
    // 1. Prepara os dados das armas escolhidas E injeta a Efetividade Máxima
    const formattedWeps = formatWeaponsForComp()
        .filter(w => compSelectedWeapons.includes(w.NomeItem))
        // A MÁGICA AQUI: Removemos a ordem alfabética e forçamos a leitura da indexação do Carrinho!
        .sort((a, b) => compSelectedWeapons.indexOf(a.NomeItem) - compSelectedWeapons.indexOf(b.NomeItem))
        .map(w => {
            let maxEff = "-";
            if (db.damageData) {
                // Acha o primeiro dano registrado da arma e puxa o alcance inicial
                let dmgRow = db.damageData.find(d => d.Arma === w.NomeItem);
                if (dmgRow) {
                    let parsed = parseDamageString(dmgRow["dano(alcance)"]);
                    if (parsed.length > 0) {
                        maxEff = parsed[0].alcance;
                    }
                }
            }
            w.EfetividadeMaxima = maxEff;
            return w;
        });
    
    const powerMap = { "Low":1, "Mid-Low":2, "Medium":3, "Mid-High":4, "High":5, "Ultra High":6, "Baixo":1, "Médio-Baixo":2, "Médio":3, "Médio-Alto":4, "Alto":5, "Ultra-Alto":6 };
    
    // --- TEXTOS DAS ARMAS EXPANDIDOS COM A NOVA COLUNA ---
    const attrT = t.compResAttributes;
    
    const attributes = [
        { label: attrT.cls, prop: "ClasseDisplay", isNum: false },
        { label: attrT.cal, prop: "Calibre", isNum: false },
        { label: attrT.vrc, prop: "RecuoVertical", isNum: true }, 
        { label: attrT.hrc, prop: "RecuoHorizontal", isNum: true },
        { label: attrT.ergo, prop: "Ergonomia", isNum: true },
        { label: attrT.ads, prop: "EstabilidadeArma", isNum: true },
        { label: attrT.acc, prop: "Precisao", isNum: true },
        { label: attrT.hip, prop: "EstabilidadeHipFire", isNum: true },
        { label: attrT.range, prop: "Alcance", isNum: true },
        { 
            label: attrT.maxRange, 
            prop: "EfetividadeMaxima", 
            isNum: true,
            tooltipText: attrT.maxRangeTip
        },
        { label: attrT.muz, prop: "VelocidadeBocal", isNum: true },
        { label: attrT.fire, prop: "ModoDisparoDisplay", isNum: false },
        { label: attrT.rof, prop: "Cadencia", isNum: true },
        { label: attrT.power, prop: "PoderFogoDisplay", isNum: true, map: powerMap },
        { label: attrT.barrel, prop: "CanoDisplay", isNum: false }
    ];
    
    // Mapeia mínimos e máximos para pintar verde/vermelho
    let statsMap = {};
    attributes.forEach(attr => {
        if (attr.isNum) {
            let vals = formattedWeps.map(w => {
                let raw = String(w[attr.prop] || "-");
                return attr.map ? (attr.map[raw] || 0) : parseFloat(raw.replace(/[^\d.-]/g, ''));
            }).filter(n => !isNaN(n));
            if (vals.length > 0) statsMap[attr.prop] = { min: Math.min(...vals), max: Math.max(...vals) };
        }
    });

    // ======================================================
    // SEÇÃO 1: ARMAS EM COLUNAS (FICHAS - COM MIRA CRUZADA E TOOLTIPS)
    // ======================================================
    let wepContainer = document.createElement('div');
    wepContainer.className = 'res-wep-container';

    // Coluna 0: Rótulos
    let colLabels = document.createElement('div');
    colLabels.className = 'res-col-labels';
    colLabels.innerHTML = `<div class="res-cell res-cell-head" style="background:transparent; color: var(--text-dim); justify-content: flex-start;">${t.compResAttribute}</div>`;
    
    attributes.forEach((attr, rowIndex) => {
        let tooltipClass = "";
        let tooltipTitle = "";
        
        if (attr.tooltipText) {
            tooltipTitle = ` title="${attr.tooltipText}"`;
            tooltipClass = " has-dynamic-tooltip";
        }
        
        colLabels.innerHTML += `<div class="res-cell res-cell-label${tooltipClass}"${tooltipTitle} data-row="${rowIndex}" style="transition: background-color 0.15s ease;">${attr.label}</div>`;
    });
    wepContainer.appendChild(colLabels);

    // Colunas de N: Armas
    formattedWeps.forEach((w, colIndex) => {
        let col = document.createElement('div');
        col.className = 'res-col-wep';
        col.setAttribute('data-col', colIndex);
        
        let htmlInner = `<div class="res-cell res-cell-head" data-col="${colIndex}" style="transition: background-color 0.15s ease;">${w.NomeItem}</div>`;
        
        attributes.forEach((attr, rowIndex) => {
            let raw = String(w[attr.prop] || "-");
            let color = 'var(--text-main)';
            
            let tooltipClass = "";
            let tooltipTitle = "";
            
            if (attr.isNum && statsMap[attr.prop] && statsMap[attr.prop].min !== statsMap[attr.prop].max) {
                let num = attr.map ? (attr.map[raw] || 0) : parseFloat(raw.replace(/[^\d.-]/g, ''));
                if (!isNaN(num)) {
                    let best = attr.invert ? statsMap[attr.prop].min : statsMap[attr.prop].max;
                    let worst = attr.invert ? statsMap[attr.prop].max : statsMap[attr.prop].min;
                    if (num === best) color = 'var(--success)';
                    else if (num === worst) color = 'var(--fail)';
                }
            }

            if (attr.prop === "CanoDisplay") {
                const greenTiers = ["D+ R+", "D+ A+", "R+", "A+", "D+", "FB D+", "CF D+", "Default +", "Padrão +", "CustomD+", "Custom D+", "FBNMD+", "CFSB D+", "R+ WD+", "A+ DA+", "D+ R+ WD+", "D+ A+ DA+"];
                const redTiers = ["FB D-", "CF D-", "CustomD-", "Custom D-", "FBNMD-", "CFSB D-", "Default -", "Padrão -", "R+ WD-", "A+ DA-", "D+ R+ WD-", "D+ A+ DA-"];
                
                if (greenTiers.includes(raw)) {
                    color = 'var(--success)'; 
                } else if (redTiers.includes(raw)) {
                    color = 'var(--fail)'; 
                }
            }

            if (attr.prop === "CanoDisplay") {
                let rawVal = raw;
                // --- MÁGICA DA TRADUÇÃO UNIVERSAL DO TOOLTIP ---
                if (currentLang !== 'en') {
                    const dicCano = translations[currentLang].dataDict?.weapons?.TipoCano;
                    if (dicCano) {
                        const foundKey = Object.keys(dicCano).find(k => dicCano[k] === raw);
                        if (foundKey) rawVal = foundKey;
                    }
                }
                const tooltipText = t.tooltipBarrel ? t.tooltipBarrel[rawVal] : null;
                if (tooltipText) {
                    tooltipTitle = ` title="${tooltipText}"`;
                    tooltipClass = " has-dynamic-tooltip";
                }
            }

            htmlInner += `<div class="res-cell res-cell-value${tooltipClass}"${tooltipTitle} data-col="${colIndex}" data-row="${rowIndex}" style="color: ${color}; transition: background-color 0.15s ease;">${raw}</div>`;
        });
        col.innerHTML = htmlInner;
        wepContainer.appendChild(col);
    });
    container.appendChild(wepContainer);

    // --- ATIVA O RADAR NAS FICHAS DE ARMAS (Javascript Event Listeners) ---
    const allWepCells = wepContainer.querySelectorAll('.res-cell');
    
    wepContainer.addEventListener('mouseover', (e) => {
        const cell = e.target.closest('.res-cell');
        if (!cell) return;

        const rowId = cell.getAttribute('data-row');
        const colId = cell.getAttribute('data-col');

        allWepCells.forEach(c => c.classList.remove('crosshair-highlight'));

        if (!rowId && !colId) return; 

        if (rowId && !colId) {
            cell.classList.add('crosshair-highlight');
            return;
        }

        if (colId && !rowId) {
            cell.classList.add('crosshair-highlight');
            return;
        }

        cell.classList.add('crosshair-highlight'); 
        
        const rowLabel = wepContainer.querySelector(`.res-col-labels .res-cell[data-row="${rowId}"]`);
        if (rowLabel) rowLabel.classList.add('crosshair-highlight');

        const colHeader = wepContainer.querySelector(`.res-col-wep[data-col="${colId}"] .res-cell-head`);
        if (colHeader) colHeader.classList.add('crosshair-highlight');
    });

    wepContainer.addEventListener('mouseout', () => {
        allWepCells.forEach(c => c.classList.remove('crosshair-highlight'));
    });

    // ======================================================
    // SEÇÃO 2: MUNIÇÕES EM TABELAS EXCLUSIVAS (COM "A ESCADINHA")
    // ======================================================
    const uniqueCalibers = Array.from(new Set(formattedWeps.map(w => w.Calibre))).sort();
    const formattedAmmo = formatAmmoForComp(); 
    const chanceMap = { "Very High":5, "High":4, "Medium":3, "Low":2, "Very Low":1, "Alto":4, "Médio":3, "Baixo":2 };
    
    let globalAmmoList = [];
    uniqueCalibers.forEach(cal => {
        formattedAmmo.forEach(a => {
            if (a.Calibre === cal) {
                const nivelBloqueado = compFiltersActive["NivelPenetracao"] && compFiltersActive["NivelPenetracao"].includes(String(a.NivelPenetracao));
                const chanceBloqueada = compFiltersActive["ChanceFerirDisplay"] && compFiltersActive["ChanceFerirDisplay"].includes(a.ChanceFerirDisplay);
                
                if (nivelBloqueado || chanceBloqueada) return; 

                let danoStr = String(a.DanoBase || "0").trim();
                
                const pelletMatch = danoStr.match(/(\d+)\s*[xX]\s*(\d+)/);
                let pelletCount = 1;
                
                if (pelletMatch) {
                    pelletCount = parseInt(pelletMatch[2], 10);
                }

                const totalMatch = danoStr.match(/\((\d+)\)/);
                let danoInt = totalMatch ? parseInt(totalMatch[1]) : (parseInt(danoStr.replace(/[^\d]/g, '')) || 0);

                let chanceInt = chanceMap[a.ChanceFerirDisplay] || chanceMap[a.ChanceFerir] || 0;
                
                let ferimentoVal = parseFloat(a.FerimentoContuso);
                if (isNaN(ferimentoVal)) ferimentoVal = 0;
                
                globalAmmoList.push({
                    Nome: a.NomeItem, Calibre: cal,
                    Lv: parseInt(a.NivelPenetracao || 0), Pen: parseInt(a.ValorPenetracao || a.Penetracao || 0),
                    DanoDisplay: danoStr, DanoInt: danoInt, PelletCount: pelletCount,
                    DanoBlind: parseInt(a.DanoArmadura || a.DanoBlindagem || 0),
                    FerimentoContuso: ferimentoVal, 
                    Vel: parseInt(a.Velocidade || 0), Prec: parseInt(a.Precisao || 0),
                    CRV: parseInt(a.RecuoVertical || 0), CRH: parseInt(a.RecuoHorizontal || 0),
                    ChanceDisplay: a.ChanceFerirDisplay || "//////", ChanceInt: chanceInt
                });
            }
        });
    });
    
    uniqueCalibers.forEach((cal, calIndex) => {
        let calWeps = formattedWeps.filter(w => w.Calibre === cal).map(w => w.NomeItem).join(" / ");
        let calAmmo = globalAmmoList.filter(a => a.Calibre === cal).sort((a, b) => b.Lv - a.Lv || b.Pen - a.Pen);
        if (calAmmo.length === 0) return;
        
        let ammoBlock = document.createElement('div');
        ammoBlock.className = 'res-ammo-block';
        
        let html = `
            <div class="res-ammo-head">
                <div class="res-ammo-title">${t.compResAmmoTitle}${cal}</div>
                <div class="res-ammo-subtitle">${t.compResAmmoCompat}${calWeps}</div>
            </div>
            <table class="res-ammo-table" id="ammo-table-${calIndex}" style="table-layout: fixed; width: 895px; max-width: none;">
                <thead>
                    <tr>
                        <th data-col="0" style="text-align: left; width: 20%;">${t.compResTableHeaders.itemName}</th>
                        <th data-col="1" style="width: 8%;">${t.compResTableHeaders.penLevel}</th>
                        <th data-col="2" style="width: 8%;">${t.compResTableHeaders.penetration}</th>
                        <th data-col="3" style="width: 8%;">${t.compResTableHeaders.baseDmg}</th>
                        <th data-col="4" style="width: 8%;">${t.compResTableHeaders.armorDmg}</th>
                        <th data-col="5" style="width: 8%;">${t.compResTableHeaders.bluntTrauma}</th>
                        <th data-col="6" style="width: 8%;">${t.compResTableHeaders.velocity}</th>
                        <th data-col="7" style="width: 8%;">${t.compResTableHeaders.accuracy}</th>
                        <th data-col="8" style="width: 8%;">${t.compResTableHeaders.vrc}</th>
                        <th data-col="9" style="width: 8%;">${t.compResTableHeaders.hrc}</th>
                        <th data-col="10" style="width: 8%;">${t.compResTableHeaders.woundChance}</th>
                    </tr>
                </thead>
                <tbody>`;
                
        calAmmo.forEach((a, rowIndex) => {
            let matchingWeps = formattedWeps.filter(w => w.Calibre === cal);
            let hasSubRows = matchingWeps.length > 0 && db.damageData;
            
            let wepDmgList = [];
            if (hasSubRows) {
                matchingWeps.forEach(w => {
                    let dmgRow = db.damageData.find(d => d.Arma === w.NomeItem && d["nome da munição"] === a.Nome);
                    if (dmgRow) {
                        let parsed = parseDamageString(dmgRow["dano(alcance)"]);
                        if (parsed.length > 0) {
                            let maxPerPellet = Math.max(...parsed.map(p => p.dano));
                            let maxTotal = maxPerPellet * a.PelletCount;
                            
                            wepDmgList.push({ 
                                arma: w.NomeItem, 
                                danoPorPellet: maxPerPellet, 
                                danoTotal: maxTotal 
                            });
                        }
                    }
                });
            }
            
            let maxWepDmgTotal = wepDmgList.length > 0 ? Math.max(...wepDmgList.map(i => i.danoTotal)) : 0;
            
            if (hasSubRows) {
                matchingWeps.sort((wA, wB) => {
                    let dataA = wepDmgList.find(i => i.arma === wA.NomeItem);
                    let dataB = wepDmgList.find(i => i.arma === wB.NomeItem);
                    let danoA = dataA ? dataA.danoTotal : 0;
                    let danoB = dataB ? dataB.danoTotal : 0;
                    
                    return danoA - danoB; 
                });
            }

            html += `
                    <tr data-row="${rowIndex}" class="${hasSubRows ? 'row-parent' : ''}">
                        <td data-col="0" data-row="${rowIndex}" style="text-align: left; color: var(--orange-accent); white-space: normal;">${a.Nome}</td>
                        <td data-col="1" data-row="${rowIndex}">${a.Lv}</td>
                        <td data-col="2" data-row="${rowIndex}">${a.Pen}</td>
                        <td data-col="3" data-row="${rowIndex}">${a.DanoDisplay}</td>
                        <td data-col="4" data-row="${rowIndex}">${a.DanoBlind}</td>
                        <td data-col="5" data-row="${rowIndex}">${a.FerimentoContuso > 0 ? a.FerimentoContuso.toFixed(1) : "-"}</td>
                        <td data-col="6" data-row="${rowIndex}">${a.Vel}</td>
                        <td data-col="7" data-row="${rowIndex}">${a.Prec}</td>
                        <td data-col="8" data-row="${rowIndex}">${a.CRV}</td>
                        <td data-col="9" data-row="${rowIndex}">${a.CRH}</td>
                        <td data-col="10" data-row="${rowIndex}">${a.ChanceDisplay}</td>
                    </tr>`;
            
            if (hasSubRows) {
                matchingWeps.forEach(w => {
                    let dmgDisplay = "N/A";
                    let colorStyle = ""; 

                    let weaponData = wepDmgList.find(i => i.arma === w.NomeItem);
                    if (weaponData) {
                        
                        if (a.PelletCount > 1) {
                            dmgDisplay = `${weaponData.danoPorPellet}x${a.PelletCount} (${weaponData.danoTotal})`;
                        } else {
                            dmgDisplay = `${weaponData.danoTotal}`;
                        }
                        
                        if (weaponData.danoTotal < a.DanoInt) {
                            colorStyle = "color: var(--fail) !important;"; 
                        }
                        else if (weaponData.danoTotal === maxWepDmgTotal && weaponData.danoTotal > a.DanoInt) {
                            colorStyle = "color: var(--success) !important;";
                        }
                    }

                    html += `
                    <tr class="res-ammo-subrow">
                        <td class="subrow-wep-name">${w.NomeItem} <span class="subrow-label">- ${t.compResAmmoMaxDmg}</span></td>
                        <td class="subrow-empty"></td>
                        <td class="subrow-empty"></td>
                        <td class="subrow-value" style="${colorStyle}">${dmgDisplay}</td>
                        <td colspan="7" class="subrow-empty"></td>
                    </tr>`;
                });
            }
            
            if (rowIndex < calAmmo.length - 1) {
                html += `<tr class="ammo-spacer"><td colspan="11"></td></tr>`;
            }
        });
        html += `</tbody></table>`;
        ammoBlock.innerHTML = html;
        container.appendChild(ammoBlock);
    });
}

// =====================================================================
// SISTEMA DE NOTIFICAÇÕES FLUTUANTES (TOAST)
// =====================================================================
function showCustomToast(message) {
    // 1. Verifica se já existe um contêiner de notificações, senão cria um
    let toastContainer = document.getElementById('custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'custom-toast-container';
        // Posiciona no centro-inferior da tela
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '30px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.zIndex = '9999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.alignItems = 'center';
        toastContainer.style.gap = '10px';
        toastContainer.style.pointerEvents = 'none'; // Evita bloquear cliques
        document.body.appendChild(toastContainer);
    }

    // 2. Cria a caixinha do aviso
    const toast = document.createElement('div');
    toast.innerHTML = message;
    
    // Estilo visual combinando com seu tema
    toast.style.backgroundColor = 'rgba(30, 30, 30, 0.95)'; // Fundo escuro
    toast.style.color = 'var(--text-main)'; // Texto claro
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
    toast.style.border = '1px solid var(--orange-accent)'; // Borda laranja
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '1rem';
    
    // Preparando animação (começa invisível e um pouco mais para baixo)
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    toastContainer.appendChild(toast);

    // 3. Faz o aviso aparecer suavemente
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // 4. Faz o aviso sumir após 3 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        // Remove do HTML depois que a animação de sumir terminar
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300); 
    }, 3000);
}

// =====================================================================
// MOTOR DO GRÁFICO DE LIMITES DE DANO (LIMITES DE DANO POR ALCANCE)
// =====================================================================

let isDmgInitialized = false;
let dmgActiveChartCombos = [];
let dmgChartInstance = null;

// Cores e estilos nativos do Chart.js que substituem as lógicas do PowerShell
const dmgChartColors = ['#FFA500', '#1E90FF', '#32CD32', '#9370DB', '#FF1493'];
const dmgChartStyles = ['circle', 'rect', 'triangle', 'rectRot', 'crossRot']; 

// 1. CARREGAMENTO DOS MENUS DE SELEÇÃO (DROPDOWNS)
function initDamageChart(forceRebuild = false) {
    if (isDmgInitialized && !forceRebuild) return;

    const cbClass = document.getElementById('dmg-cb-class');
    if (!cbClass) return;
    
    const currentSelectedClass = cbClass.value; 
    
    const t = translations[currentLang];
    
    // Fallback Neutro
    const txtClass = (t.dmgDynamicTexts && t.dmgDynamicTexts.selectClass) ? t.dmgDynamicTexts.selectClass : 'Select Class...';
    
    cbClass.innerHTML = `<option value="" disabled ${!currentSelectedClass ? 'selected' : ''} hidden>${txtClass}</option>`;
    
    const weaponsWithData = new Set(db.damageData.map(d => d.Arma));
    const filteredWeps = db.weapons.filter(w => weaponsWithData.has(w.NomeItem));
    
    let uniqueClassesMap = new Map();
    
    filteredWeps.forEach(w => {
        let catName = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', w.Classe) : w.Classe;
        if (w.Classe) uniqueClassesMap.set(w.Classe, catName);
    });

    const sortedRawClasses = Array.from(uniqueClassesMap.keys()).sort((a, b) => {
        return uniqueClassesMap.get(a).localeCompare(uniqueClassesMap.get(b));
    });

    sortedRawClasses.forEach(rawCls => {
        let opt = document.createElement('option');
        opt.value = rawCls; 
        opt.textContent = uniqueClassesMap.get(rawCls); 
        if (rawCls === currentSelectedClass) opt.selected = true;
        cbClass.appendChild(opt);
    });

    isDmgInitialized = true;
    
    if (currentSelectedClass) {
        dmgChangeClass(currentSelectedClass, true);
    }
}

function dmgChangeClass(classRaw, isLangRefresh = false) {
    const cbWeapon = document.getElementById('dmg-cb-weapon');
    const cbAmmo = document.getElementById('dmg-cb-ammo');
    
    const t = translations[currentLang];
    
    // Novo Fallback Neutro (Inglês como padrão de emergência)
    const txtWep = (t.dmgDynamicTexts && t.dmgDynamicTexts.selectWeapon) ? t.dmgDynamicTexts.selectWeapon : 'Select Weapon...';
    const txtAmmoWait = (t.dmgDynamicTexts && t.dmgDynamicTexts.waitWeapon) ? t.dmgDynamicTexts.waitWeapon : 'Waiting for Weapon...';
    
    // Salva a arma se for apenas um recarregamento de idioma
    const oldWep = isLangRefresh ? cbWeapon.value : "";
    
    cbWeapon.innerHTML = `<option value="" disabled ${!oldWep ? 'selected' : ''} hidden>${txtWep}</option>`;
    
    if (!isLangRefresh) {
        cbAmmo.innerHTML = `<option value="" disabled selected hidden>${txtAmmoWait}</option>`;
        cbAmmo.disabled = true;
    }
    
    cbWeapon.disabled = true;
    
    if (!classRaw) {
        dmgValidateAddButton();
        return;
    }
    
    const weaponsWithData = new Set(db.damageData.map(d => d.Arma));
    const filteredWeps = db.weapons.filter(w => weaponsWithData.has(w.NomeItem));
    
    // MÁGICA DE ESTABILIDADE: Compara direto com w.Classe bruto! Não quebra na troca de idioma.
    let wepsInClass = filteredWeps.filter(w => w.Classe === classRaw).sort((a, b) => a.NomeItem.localeCompare(b.NomeItem));

    wepsInClass.forEach(w => {
        let cal = w.Calibre ? w.Calibre : "N/A";
        let opt = document.createElement('option');
        opt.value = w.NomeItem; 
        opt.textContent = `${w.NomeItem} (${cal})`; 
        if (isLangRefresh && w.NomeItem === oldWep) opt.selected = true;
        cbWeapon.appendChild(opt);
    });
    
    cbWeapon.disabled = false;
    
    if (isLangRefresh && oldWep) {
        dmgChangeWeapon(oldWep, true);
    } else {
        dmgValidateAddButton();
    }
}

function dmgChangeWeapon(weaponName, isLangRefresh = false) {
    const cbAmmo = document.getElementById('dmg-cb-ammo');
    
    const t = translations[currentLang];
    
    // Novo Fallback Neutro
    const txtAmmo = (t.dmgDynamicTexts && t.dmgDynamicTexts.selectAmmo) ? t.dmgDynamicTexts.selectAmmo : 'Select Ammo...';
    
    const oldAmmo = isLangRefresh ? cbAmmo.value : "";
    
    cbAmmo.innerHTML = `<option value="" disabled ${!oldAmmo ? 'selected' : ''} hidden>${txtAmmo}</option>`;
    cbAmmo.disabled = true;
    
    if (!weaponName) {
        dmgValidateAddButton();
        return;
    }
    
    const dmgRows = db.damageData.filter(d => d.Arma === weaponName);
    const ammoNames = Array.from(new Set(dmgRows.map(d => d["nome da munição"])));
    
    let wInfo = db.weapons.find(w => w.NomeItem === weaponName);
    let cal = wInfo ? wInfo.Calibre : null;
    
    let ammoList = [];
    
    ammoNames.forEach(aName => {
        const inUse = dmgActiveChartCombos.some(c => c.weapon === weaponName && c.ammo === aName);
        if (!inUse) {
            let ammoRow = db.ammo.find(a => a.NomeItem === aName && a.Calibre === cal);
            if (!ammoRow) ammoRow = db.ammo.find(a => a.NomeItem === aName); 
            
            let lvlNum = 99;
            let lvlDisplay = "?";
            if (ammoRow && ammoRow.NivelPenetracao) {
                lvlNum = parseInt(ammoRow.NivelPenetracao, 10);
                lvlDisplay = `${translations[currentLang].lblLvl}${ammoRow.NivelPenetracao}`;
            }
            
            ammoList.push({
                name: aName,
                lvlNum: isNaN(lvlNum) ? 99 : lvlNum,
                display: `${aName} (${lvlDisplay})`
            });
        }
    });
    
    ammoList.sort((a, b) => {
        if (a.lvlNum !== b.lvlNum) return a.lvlNum - b.lvlNum;
        return a.name.localeCompare(b.name);
    });
    
    ammoList.forEach(aObj => {
        let opt = document.createElement('option');
        opt.value = aObj.name;
        opt.textContent = aObj.display;
        if (isLangRefresh && aObj.name === oldAmmo) opt.selected = true;
        cbAmmo.appendChild(opt);
    });
    
    if (ammoList.length > 0) {
        cbAmmo.disabled = false;
    }
    
    dmgValidateAddButton();
}

function dmgValidateAddButton() {
    const cbWeapon = document.getElementById('dmg-cb-weapon');
    const cbAmmo = document.getElementById('dmg-cb-ammo');
    const btnAdd = document.getElementById('btn-dmg-add');
    const t = translations[currentLang];
    
    const wVal = cbWeapon ? cbWeapon.value : "";
    const aVal = cbAmmo ? cbAmmo.value : "";
    
    // Regra do Limite: O botão se tranca e fica cinza (mantendo a borda visível)
    if (dmgActiveChartCombos.length >= 5) {
        btnAdd.textContent = t.dmgCountFull;
        btnAdd.disabled = true;
        btnAdd.style.cursor = 'not-allowed';
        btnAdd.style.backgroundColor = 'var(--button-back)';
        btnAdd.style.color = 'var(--text-dim)';
        btnAdd.style.borderColor = 'var(--button-hover)'; // <-- MANTÉM A BORDA DEFINIDA
        return;
    }
    
    // Regra da Validação: Se não escolheu ambos, o botão fica apagado (mantendo a borda visível)
    if (!wVal || !aVal) {
        btnAdd.textContent = t.btnDmgAdd;
        btnAdd.disabled = true;
        btnAdd.style.cursor = 'not-allowed';
        btnAdd.style.backgroundColor = 'var(--button-back)';
        btnAdd.style.color = 'var(--text-dim)';
        btnAdd.style.borderColor = 'var(--button-hover)'; // <-- MANTÉM A BORDA DEFINIDA
        return;
    }
    
    // Regra de Liberação: Botão brilha em Laranja e fica clicável
    btnAdd.textContent = t.btnDmgAdd;
    btnAdd.disabled = false;
    btnAdd.style.cursor = 'pointer';
    btnAdd.style.backgroundColor = 'var(--orange-accent)';
    btnAdd.style.color = 'var(--background)';
    btnAdd.style.borderColor = 'var(--orange-accent)';
}

// 2. FUNÇÕES LÓGICAS (O MATEMÁTICO DO PS1)
function dmgAddChartCombo() {
    const cbWeapon = document.getElementById('dmg-cb-weapon');
    const cbAmmo = document.getElementById('dmg-cb-ammo');
    
    const wName = cbWeapon.value;
    const aName = cbAmmo.value;
    
    if (!wName || !aName) return;
    
    // Pega a label do Dropdown para manter a formatação bonita (ex: "M4A1 (5.56x45mm)")
    const aDisplay = cbAmmo.options[cbAmmo.selectedIndex].text.replace(/ \(([^)]+)\)$/, ' - $1'); 
    const comboName = `${wName} (${aDisplay})`;
    
    const dmgRow = db.damageData.find(d => d.Arma === wName && d["nome da munição"] === aName);
    if (!dmgRow) return;
    
    // Parse da string de danos (O Seu Motor Matemático Limpo)
    let rawStr = dmgRow["dano(alcance)"];
    if (!rawStr || rawStr === "/////") return;
    
    let pairs = rawStr.split('|').map(s => s.trim());
    let plotData = [];
    pairs.forEach(p => {
        let match = p.match(/^(\d+)\((\d+)\)$/);
        if (match) {
            plotData.push({ dano: parseInt(match[1], 10), alcance: parseInt(match[2], 10), simulado: false });
        }
    });
    
    // Simulação artificial se tiver 1 ponto (-30% de dano e +3 metros)
    if (plotData.length === 1) {
        let dFinal = Math.round(plotData[0].dano * 0.70);
        let aFinal = plotData[0].alcance + 3;
        plotData.push({ dano: dFinal, alcance: aFinal, simulado: true });
    }
    
    // Descobre o Multiplicador da Escopeta a partir do db.ammo
    let wInfo = db.weapons.find(w => w.NomeItem === wName);
    let cal = wInfo ? wInfo.Calibre : null;
    let ammoRow = db.ammo.find(a => a.NomeItem === aName && a.Calibre === cal);
    if (!ammoRow) ammoRow = db.ammo.find(a => a.NomeItem === aName);
    
    let pCount = 1;
    let pText = "";
    let bDmg = 0;
    
    if (ammoRow && ammoRow.DanoBase) {
        const dMatch = ammoRow.DanoBase.match(/^(\d+)(x\d+)?/i);
        if (dMatch) {
            bDmg = parseInt(dMatch[1], 10);
            if (dMatch[2]) {
                pText = dMatch[2].toLowerCase();
                pCount = parseInt(pText.replace('x', ''), 10);
            }
        }
    }
    
    // Multiplica o Y do gráfico pelo número de pellets (Chumbos)
    plotData.forEach(p => {
        p.danoTotal = p.dano * pCount;
    });

    dmgActiveChartCombos.push({
        name: comboName,
        weapon: wName,
        ammo: aName,
        data: plotData,
        pelletCount: pCount,
        pelletText: pText,
        baseDmg: bDmg,
        color: dmgChartColors[dmgActiveChartCombos.length],
        marker: dmgChartStyles[dmgActiveChartCombos.length]
    });
    
    dmgUpdateChartEngine();
}

function dmgClearAll() {
    dmgActiveChartCombos = [];
    dmgUpdateChartEngine();
}

function dmgRemoveCombo(index) {
    dmgActiveChartCombos.splice(index, 1);
    // Reatribui cores e marcadores na ordem correta para não quebrar a paleta
    dmgActiveChartCombos.forEach((c, idx) => {
        c.color = dmgChartColors[idx];
        c.marker = dmgChartStyles[idx];
    });
    dmgUpdateChartEngine();
}

// 3. RENDERIZAÇÃO FÍSICA E VISUAL NA TELA
function dmgUpdateChartEngine(rebuildChart = true) {
    const t = translations[currentLang];
    
    // Atualiza o Contador Visual
    const lblCount = document.getElementById('lbl-dmg-count');
    if (lblCount) {
        const restantes = 5 - dmgActiveChartCombos.length;
        lblCount.textContent = restantes + (t.dmgCountSuffix || " Armas restantes");
    }
    
    // --- NOVO: Trava o Botão de Exportar se não houver dados ---
    const btnDmgExport = document.getElementById('btn-dmg-export');
    if (btnDmgExport) {
        if (dmgActiveChartCombos.length === 0) {
            btnDmgExport.disabled = true;
            btnDmgExport.style.opacity = '0.5';
            btnDmgExport.style.cursor = 'not-allowed';
        } else {
            btnDmgExport.disabled = false;
            btnDmgExport.style.opacity = '1';
            btnDmgExport.style.cursor = 'pointer';
        }
    }
    
    // ---------------------------------------------------------
    // ATUALIZAÇÃO DA TABELA (HUD TÁTICO - MODO FORÇA BRUTA)
    // ---------------------------------------------------------
    const thead = document.getElementById('dmg-table-head');
    const tbody = document.getElementById('dmg-table-body');
    
    // TRAVA DE MESA: Ignora o CSS externo e crava a estrutura
    if (tbody && tbody.parentElement) {
        tbody.parentElement.style.borderCollapse = 'separate';
        tbody.parentElement.style.borderSpacing = '0 5px'; /* Matemática 64% (Era 8px) */
    }
    
    // Atualiza Cabeçalho
    if (thead) {
        thead.innerHTML = `
            <tr>
                <th style="text-align: left; width: 28%; background-color: var(--button-hover); color: var(--text-main); font-size: 0.6rem; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); border-top-left-radius: 4px; letter-spacing: 1px;">${t.dmgTableHeaders.combo}</th>
                
                <!-- NOVA COLUNA: CADÊNCIA -->
                <th style="text-align: left; width: 11%; background-color: var(--button-hover); color: var(--text-main); font-size: 0.6rem; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); letter-spacing: 1px;">
                    <span title="${t.dmgDynamicTexts.tipRof}" style="cursor: help;">${t.dmgDynamicTexts.colRof}</span>
                </th>

                <th style="text-align: left; width: 17%; background-color: var(--button-hover); color: var(--text-main); font-size: 0.6rem; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); letter-spacing: 1px;">
                    <span title="${t.dmgDynamicTexts.tipHeaderDamage || ''}" style="cursor: help;">${t.dmgTableHeaders.damage}</span>
                </th>
                
                <th style="text-align: left; width: 22%; background-color: var(--button-hover); color: var(--text-main); font-size: 0.6rem; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); letter-spacing: 1px;">
                    <span title="${t.dmgDynamicTexts.tipHeaderRange || ''}" style="cursor: help;">${t.dmgTableHeaders.range}</span>
                </th>
                
                <th style="text-align: left; width: 17%; background-color: var(--button-hover); color: var(--text-main); font-size: 0.6rem; text-transform: uppercase; padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); letter-spacing: 1px;">${t.dmgTableHeaders.efficiency}</th>
                <th style="width: 5%; background-color: var(--button-hover); padding: 4px 6px; border-bottom: 1px solid var(--orange-accent); border-top-right-radius: 4px;"></th>
            </tr>
        `;
    }
    
    // Atualiza Corpo
    if (tbody) {
        tbody.innerHTML = '';
        
        // LOOP DE EXATAMENTE 5 ESPAÇOS (HUD FIXO)
        for (let index = 0; index < 5; index++) {
            const combo = dmgActiveChartCombos[index];
            const tr = document.createElement('tr');
            
            // TRAVA DE LINHA: Altura reduzida e inegociável em 64% (24px)
            tr.style.height = "24px"; 
            tr.style.maxHeight = "24px";
            tr.style.overflow = "hidden";
            
            if (combo) {
                // --- 1. MOTOR DE PARSER DE NOME ---
                let wName = combo.name;
                let aName = "";
                let aLvl = "";
                const regexMatch = combo.name.match(/^(.*?)\s*\((.*?)(?:\s*-\s*(.*))?\)$/);
                if (regexMatch) {
                    wName = regexMatch[1].trim();
                    aName = regexMatch[2].trim();
                    if (regexMatch[3]) {
                        aLvl = regexMatch[3].trim();
                        // --- TRADUTOR DINÂMICO PARA DESCONGELAR A SIGLA ---
                        const tLvl = translations[currentLang].lblLvl;
                        aLvl = aLvl.replace('Lv.', tLvl).replace('Nv.', tLvl);
                    }
                }

                let comboNameHTML = `<span style="font-weight: 900; color: var(--text-main); font-size: 0.64rem; margin-right: 2px;">${wName}</span>`;
                if (aName) comboNameHTML += `<span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--orange-accent); padding: 1px 3px; border-radius: 3px; font-size: 0.54rem; font-weight: bold; white-space: nowrap;">${aName}</span>`;
                if (aLvl) comboNameHTML += `<span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); padding: 1px 3px; border-radius: 3px; font-size: 0.54rem; font-weight: bold; white-space: nowrap;">${aLvl}</span>`;

                // --- DADOS BÁSICOS ---
                let wInfo = db.weapons.find(w => w.NomeItem === combo.weapon);
                let baseRange = 0;
                let tipoCanoRaw = ""; 
                let cadenciaRaw = t.dmgDynamicTexts.na || "N/A"; 
                
                if (wInfo) {
                    if (wInfo.Alcance) {
                        const rMatch = String(wInfo.Alcance).match(/(\d+)/);
                        if (rMatch) baseRange = parseInt(rMatch[1], 10);
                    }
                    if (wInfo.TipoCano) tipoCanoRaw = String(wInfo.TipoCano);
                    
                    if (wInfo.Cadencia) {
                        let numCad = parseInt(wInfo.Cadencia, 10);
                        cadenciaRaw = isNaN(numCad) ? "-" : `${numCad} <span style="font-size: 0.5rem; color: var(--text-dim);">RPM</span>`;
                    }
                }
                let tipoCanoLimpo = tipoCanoRaw.trim(); 

                const divisorIcon = `<span style="color: var(--text-dim); margin: 0 4px; font-size: 0.6rem; font-weight: normal; opacity: 0.7;">/</span>`;
                
                // Formatação HTML da coluna de Cadência
                let valStrCadencia = `<div style="display: flex; align-items: center; white-space: nowrap;"><span style="color: var(--text-main); font-size: 0.6rem; font-weight: bold;">${cadenciaRaw}</span></div>`;
                
                const createBadge = (txt, color, tooltipText = "") => {
                    let titleAttr = tooltipText ? ` title="${tooltipText}"` : "";
                    let helpCursor = tooltipText ? ` cursor: help;` : "";
                    return `<span style="border: 1px solid ${color}; color: ${color}; background: rgba(0,0,0,0.25); padding: 1px 3px; border-radius: 3px; font-size: 0.54rem; font-weight: bold; white-space: nowrap;${helpCursor}"${titleAttr}>${txt}</span>`;
                };

                // --- 2. MOTOR DE DANO ---
                let wepMaxTotal = 0;
                if (combo.data.length > 0) wepMaxTotal = Math.max(...combo.data.map(p => p.danoTotal));
                let ammoTotalBaseDmg = combo.baseDmg * combo.pelletCount;
                
                let isDanoIgual = (combo.pelletCount > 1) ? (Math.round(wepMaxTotal / combo.pelletCount) === combo.baseDmg) : (wepMaxTotal === combo.baseDmg);
                let corNumeroDano = wepMaxTotal > ammoTotalBaseDmg ? "var(--success)" : (wepMaxTotal < ammoTotalBaseDmg ? "var(--fail)" : "var(--text-dim)");
                
                // === CÉREBROS DOS TOOLTIPS DINÂMICOS ===
                const getWeaponDmgTooltip = (wepMax, ammoBase) => {
                    if (wepMax < ammoBase) return t.dmgDynamicTexts.tipWepLoss || "";
                    if (wepMax > ammoBase) return t.dmgDynamicTexts.tipWepGain || "";
                    return "";
                };

                const getBarrelDmgTooltip = (tipoStr, isIgual, wepMax, ammoBase) => {
                    if (isIgual) {
                        if (tipoStr === "Default") return t.dmgDynamicTexts.tipDanoDefault || "";
                        if (tipoStr === "R+") return t.dmgDynamicTexts.tipDanoNoBuff || "";
                        if (tipoStr === "Custom") return t.dmgDynamicTexts.tipDanoCustom || "";
                        if (tipoStr === "FB") return t.dmgDynamicTexts.tipDanoFixed || "";
                        if (tipoStr === "FBNM") return t.dmgDynamicTexts.tipDanoFixedNM || "";
                        if (tipoStr === "D+ R+ WD-") return t.dmgDynamicTexts.tipDanoMitigateEqual || "";
                    } else {
                        if (tipoStr === "CustomD-") return t.dmgDynamicTexts.tipDanoCustom || "";
                        if (tipoStr === "R+ WD-") return t.dmgDynamicTexts.tipDanoNoBuff || "";
                        if (tipoStr === "Default -") return t.dmgDynamicTexts.tipDanoDefault || "";
                        if (tipoStr === "FB D-") return t.dmgDynamicTexts.tipDanoFixed || "";
                        if (tipoStr === "FBNMD-") return t.dmgDynamicTexts.tipDanoFixedNM || "";
                        if (tipoStr === "D+ R+ WD-") {
                            if (wepMax < ammoBase) return t.dmgDynamicTexts.tipDanoMitigateLoss || "";
                            if (wepMax > ammoBase) return t.dmgDynamicTexts.tipDanoMitigateGain || "";
                        }
                        if (tipoStr === "R+ WD+") return t.dmgDynamicTexts.tipDanoNoBuff || "";
                        if (tipoStr === "CustomD+") return t.dmgDynamicTexts.tipDanoCustom || "";
                        if (tipoStr === "Default +") return t.dmgDynamicTexts.tipDanoDefault || "";
                        if (tipoStr === "FB D+") return t.dmgDynamicTexts.tipDanoFixed || "";
                        if (tipoStr === "FBNMD+") return t.dmgDynamicTexts.tipDanoFixedNM || "";
                        if (tipoStr === "D+ R+ WD+") return t.dmgDynamicTexts.tipDanoDoubleBuff || "";
                        if (tipoStr === "D+" || tipoStr === "D+ R+") return t.dmgDynamicTexts.tipDanoBuff || "";
                    }
                    return "";
                };

                const getRangeTooltip = (tipoStr) => {
                    const padrao = ["Default", "Default +", "Default -"];
                    const fixo = ["FB", "FB D-", "FB D+", "FBNM", "FBNMD+", "FBNMD-"];
                    const customizado = ["Custom", "CustomD+", "CustomD-"];
                    const comBuff = ["R+", "R+ WD+", "R+ WD-", "D+ R+", "D+ R+ WD+", "D+ R+ WD-"];
                    const apenasDano = ["D+"]; 
                    
                    if (padrao.includes(tipoStr)) return t.dmgDynamicTexts.tipRangeDefault || "";
                    if (fixo.includes(tipoStr)) return t.dmgDynamicTexts.tipRangeFixed || "";
                    if (customizado.includes(tipoStr)) return t.dmgDynamicTexts.tipRangeCustom || "";
                    if (apenasDano.includes(tipoStr)) return t.dmgDynamicTexts.tipRangeDPlus || "";
                    if (comBuff.includes(tipoStr)) return t.dmgDynamicTexts.tipRangeBuff || "";
                    return "";
                };
                
                // Mapeamento das listas das Etiquetas 
                const danoCanoSemGanho = ["Custom", "R+", "Default"];
                const danoCanoFixo = ["FB", "FBNM"]; 
                const danoPerdaMitigador = ["D+ R+ WD-"]; 
                const danoArmaComPerda = ["CustomD-", "R+ WD-", "Default -"]; 
                const danoArmaComPerdaFixo = ["FB D-", "FBNMD-"]; 
                const danoArmaComGanho = ["R+ WD+", "CustomD+", "Default +"]; 
                const danoArmaComGanhoFixo = ["FB D+", "FBNMD+"]; 
                
                let toolWep = getWeaponDmgTooltip(wepMaxTotal, ammoTotalBaseDmg);
                let toolCano = getBarrelDmgTooltip(tipoCanoLimpo, isDanoIgual, wepMaxTotal, ammoTotalBaseDmg);
                
                let tagsDanoHTML = "";
                if (isDanoIgual) {
                    let txt = "?";
                    if (danoCanoSemGanho.includes(tipoCanoLimpo)) txt = t.dmgDynamicTexts.badgeNoGain || "Cano S/ Ganho";
                    else if (danoCanoFixo.includes(tipoCanoLimpo)) txt = t.dmgDynamicTexts.badgeFixed || "Cano Fixo";
                    else if (danoPerdaMitigador.includes(tipoCanoLimpo)) txt = t.dmgDynamicTexts.badgeMitigator || "Cano Mitigador";
                    tagsDanoHTML = createBadge(txt, "var(--text-dim)", toolCano);
                } else {
                    let corCanoMitigador = wepMaxTotal > ammoTotalBaseDmg ? "var(--success)" : "var(--warning)";
                    let tagWepLoss = t.dmgDynamicTexts.badgeWepLoss || "Arma com Perda";
                    let tagWepGain = t.dmgDynamicTexts.badgeWepGain || "Arma com Ganho";
                    let tagCanoNoBuff = t.dmgDynamicTexts.badgeCanoNoBuff || "Cano não Bufa";
                    let tagFixed = t.dmgDynamicTexts.badgeFixed || "Cano Fixo";
                    let tagMitigator = t.dmgDynamicTexts.badgeMitigator || "Cano Mitigador";
                    let tagBuff = t.dmgDynamicTexts.badgeCanoBuff || "Cano com Buff";
                    
                    if (danoArmaComPerda.includes(tipoCanoLimpo)) tagsDanoHTML = createBadge(tagWepLoss, "var(--fail)", toolWep) + createBadge(tagCanoNoBuff, "var(--fail)", toolCano);
                    else if (danoArmaComPerdaFixo.includes(tipoCanoLimpo)) tagsDanoHTML = createBadge(tagWepLoss, "var(--fail)", toolWep) + createBadge(tagFixed, "var(--fail)", toolCano);
                    else if (danoPerdaMitigador.includes(tipoCanoLimpo)) tagsDanoHTML = createBadge(tagWepLoss, "var(--fail)", toolWep) + createBadge(tagMitigator, corCanoMitigador, toolCano);
                    else if (danoArmaComGanho.includes(tipoCanoLimpo)) tagsDanoHTML = createBadge(tagWepGain, "var(--success)", toolWep) + createBadge(tagCanoNoBuff, "var(--text-dim)", toolCano);
                    else if (danoArmaComGanhoFixo.includes(tipoCanoLimpo)) tagsDanoHTML = createBadge(tagWepGain, "var(--success)", toolWep) + createBadge(tagFixed, "var(--text-dim)", toolCano);
                    else if (tipoCanoLimpo === "D+ R+ WD+") tagsDanoHTML = createBadge(tagWepGain, "var(--success)", toolWep) + createBadge(tagBuff, "var(--success)", toolCano);
                    else if (tipoCanoLimpo === "D+" || tipoCanoLimpo === "D+ R+") tagsDanoHTML = createBadge(tagBuff, "var(--success)", toolCano);
                    else tagsDanoHTML = createBadge("?", "var(--text-dim)");
                }
                
                let baseNumStr = (combo.baseDmg > 0 ? combo.baseDmg : t.dmgDynamicTexts.na) + (combo.pelletCount > 1 ? combo.pelletText : "");
                let maxNumStr = (combo.pelletCount > 1 ? Math.round(wepMaxTotal / combo.pelletCount) + combo.pelletText : wepMaxTotal);

                let numsDanoHTML = "";
                if (isDanoIgual) {
                    numsDanoHTML = `<span style="color: var(--text-dim); font-size: 0.6rem; font-weight: bold;">${baseNumStr}</span>`;
                } else {
                    numsDanoHTML = `<div style="display: flex; align-items: center;"><span style="color: var(--text-main); font-size: 0.6rem; font-weight: bold;">${baseNumStr}</span>${divisorIcon}<span style="color: ${corNumeroDano}; font-weight: bold; font-size: 0.6rem;">${maxNumStr}</span></div>`;
                }
                let valStr1 = `<div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">${numsDanoHTML}<div style="display: flex; align-items: center; gap: 2px;">${tagsDanoHTML}</div></div>`;

                // --- 3. MOTOR DE ALCANCE ---
                let effRange = combo.data.length > 0 ? combo.data[0].alcance : 0;
                let rangeGain = effRange - baseRange;
                let valStr2 = "";
                
                if (baseRange === 0) {
                    let numsAlcanceHTML = `<div style="display: flex; align-items: center;"><span style="color: var(--text-main); font-size: 0.6rem; font-weight: bold;">?</span>${divisorIcon}<span style="color: var(--success); font-weight: bold; font-size: 0.6rem;">${effRange}m</span></div>`;
                    valStr2 = `<div style="display: flex; align-items: center; white-space: nowrap;">${numsAlcanceHTML}</div>`;
                } else {
                    let txtAlcance = "?"; 
                    let corAlcance = "var(--text-dim)"; 
                    
                    const alcanceCanoPadrao = ["Default", "Default +", "Default -"];
                    const alcanceCanoFixo = ["FB", "FB D-", "FB D+", "FBNM", "FBNMD+", "FBNMD-"];
                    const alcanceCanoCustom = ["Custom", "CustomD+", "CustomD-"];
                    const alcanceCanoComBuff = ["R+", "R+ WD+", "R+ WD-", "D+ R+", "D+ R+ WD+", "D+ R+ WD-"];
                    const alcanceCanoDano = ["D+"]; 

                    if (alcanceCanoPadrao.includes(tipoCanoLimpo)) {
                        txtAlcance = t.dmgDynamicTexts.badgeStandard || "Cano Padrão";
                    } else if (alcanceCanoFixo.includes(tipoCanoLimpo)) {
                        txtAlcance = t.dmgDynamicTexts.badgeFixed || "Cano Fixo";
                    } else if (alcanceCanoCustom.includes(tipoCanoLimpo)) {
                        txtAlcance = t.dmgDynamicTexts.badgeNoGain || "Cano Neutro";
                    } else if (alcanceCanoDano.includes(tipoCanoLimpo)) {
                        txtAlcance = t.dmgDynamicTexts.badgeNoGain || "Cano Neutro"; 
                    } else if (alcanceCanoComBuff.includes(tipoCanoLimpo)) {
                        txtAlcance = t.dmgDynamicTexts.badgeCanoBuff || "Cano com Buff";
                        corAlcance = "var(--success)"; 
                    }

                    let tagRangeHTML = createBadge(txtAlcance, corAlcance, getRangeTooltip(tipoCanoLimpo));
                    let numsAlcanceHTML = "";

                    if (baseRange === effRange) {
                        numsAlcanceHTML = `<span style="color: var(--text-dim); font-size: 0.6rem; font-weight: bold;">${baseRange}m</span>`;
                    } else {
                        let corNumRange = rangeGain > 0 ? 'var(--success)' : 'var(--fail)';
                        numsAlcanceHTML = `<div style="display: flex; align-items: center;"><span style="color: var(--text-main); font-size: 0.6rem; font-weight: bold;">${baseRange}m</span>${divisorIcon}<span style="color: ${corNumRange}; font-weight: bold; font-size: 0.6rem;">${effRange}m</span></div>`;
                    }
                    valStr2 = `<div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">${numsAlcanceHTML}<div style="display: flex; align-items: center; gap: 2px;">${tagRangeHTML}</div></div>`;
                }
                
                // --- 4. EFICIÊNCIA FINAL ---
                let effStr = "";
                if (combo.baseDmg > 0) {
                    let bonusDmg = Math.round(((wepMaxTotal - ammoTotalBaseDmg) / ammoTotalBaseDmg) * 100 * 10) / 10;
                    let partsHTML = [];
                    
                    if (bonusDmg !== 0) {
                        let sign = bonusDmg > 0 ? "+" : "";
                        let color = bonusDmg > 0 ? "var(--success)" : "var(--fail)";
                        let tipDmg = bonusDmg > 0 ? (t.dmgDynamicTexts.tipEffDmgPos || "") : (t.dmgDynamicTexts.tipEffDmgNeg || "");
                        let dmgLabel = t.dmgDynamicTexts.effDamage || "% Dano";
                        partsHTML.push(createBadge(`${sign}${bonusDmg}${dmgLabel}`, color, tipDmg));
                    }
                    
                    if (rangeGain !== 0) {
                        let sign = rangeGain > 0 ? "+" : "";
                        let color = rangeGain > 0 ? "var(--success)" : "var(--fail)";
                        let tipRange = rangeGain > 0 ? (t.dmgDynamicTexts.tipEffRangePos || "") : (t.dmgDynamicTexts.tipEffRangeNeg || "");
                        let rangeLabel = t.dmgDynamicTexts.effRange || "m Alcance";
                        partsHTML.push(createBadge(`${sign}${rangeGain}${rangeLabel}`, color, tipRange));
                    }
                    
                    if (partsHTML.length > 0) {
                        effStr = `<div style="display: flex; align-items: center; gap: 4px; white-space: nowrap;">${partsHTML.join('')}</div>`;
                    } else {
                        let tipNeutro = t.dmgDynamicTexts.tipEffNeutral || "";
                        let txtNeutro = t.dmgDynamicTexts.effNeutralBadge || "NEUTRO";
                        effStr = `<div style="display: flex; align-items: center; white-space: nowrap;">${createBadge(txtNeutro, "var(--text-dim)", tipNeutro)}</div>`;
                    }
                } else {
                    effStr = `<div style="display: flex; align-items: center; white-space: nowrap;">${createBadge(t.dmgDynamicTexts.na || "N/A", "var(--text-dim)")}</div>`;
                }
                
                // --- DESIGN DA LINHA ATIVA ---
                tr.style.backgroundColor = "var(--button-back)";
                tr.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.15)";
                
                tr.innerHTML = `
                    <td style="padding: 0; white-space: nowrap; border-top-left-radius: 4px; border-bottom-left-radius: 4px; border-left: 3px solid ${combo.color};">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; padding: 0 6px; gap: 4px;">
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${combo.color}; box-shadow: 0 0 4px ${combo.color}; flex-shrink: 0;"></span>
                            <div style="display: flex; align-items: center; gap: 3px;">${comboNameHTML}</div>
                        </div>
                    </td>
                    <td style="padding: 0; white-space: nowrap;">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; padding: 0 6px;">${valStrCadencia}</div>
                    </td>
                    <td style="padding: 0; white-space: nowrap;">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; padding: 0 6px;">${valStr1}</div>
                    </td>
                    <td style="padding: 0; white-space: nowrap;">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; padding: 0 6px;">${valStr2}</div>
                    </td>
                    <td style="padding: 0; white-space: nowrap;">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; padding: 0 6px;">${effStr}</div>
                    </td>
                    <td style="padding: 0; border-top-right-radius: 4px; border-bottom-right-radius: 4px; text-align: center;">
                        <div style="height: 24px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 0 6px;">
                            <button style="background: transparent; border: none; cursor: pointer; color: var(--fail); opacity: 0.6; padding: 2px; transition: 0.2s; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'" title="${t.dmgDynamicTexts.removeTooltip || 'Remover'}" onclick="dmgRemoveCombo(${index})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
            } else {
                // --- SE O SLOT ESTIVER VAZIO ---
                tr.classList.add('dmg-empty-slot');
                const slotText = t.dmgDynamicTexts.slotAvailable || "SLOT DISPONÍVEL";
                tr.innerHTML = `
                    <td colspan="6" style="padding: 0; border-radius: 4px; border: 1px dashed rgba(255,255,255,0.08); background: repeating-linear-gradient(45deg, rgba(255,255,255,0.01), rgba(255,255,255,0.01) 5px, transparent 5px, transparent 10px);">
                        <div style="height: 24px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; width: 100%; color: rgba(255,255,255,0.25); font-size: 0.58rem; font-weight: bold; letter-spacing: 1px;">
                            + ${slotText}
                        </div>
                    </td>
                `;
            }
            
            tbody.appendChild(tr);
        }
    }

    // Atualiza o Dropdown da Arma para bloquear a munição recém-selecionada
    const cbWeapon = document.getElementById('dmg-cb-weapon');
    if (cbWeapon && cbWeapon.value) {
        dmgChangeWeapon(cbWeapon.value);
    }
    
    // =========================================================================
    // O MOTOR GRÁFICO AVANÇADO (CHART.JS - PORT DIRETO DO POWERSHELL)
    // =========================================================================
    if (rebuildChart) {
        const ctx = document.getElementById('damageChartCanvas');
        if (!ctx) return;
        
        if (dmgChartInstance) {
            dmgChartInstance.destroy(); // Apaga o Gráfico velho da Placa de Vídeo antes de criar o novo
        }
        
        // 1. CALCULA OS LIMITES EXATOS DA TELA (MinX, MaxX, MinY, MaxY)
        let gMinX = 9999, gMaxX = 0, gMinY = 9999, gMaxY = 0;
        dmgActiveChartCombos.forEach(combo => {
            if (combo.data.length > 0) {
                if (combo.data[0].alcance < gMinX) gMinX = combo.data[0].alcance;
                if (combo.data[combo.data.length - 1].alcance > gMaxX) gMaxX = combo.data[combo.data.length - 1].alcance;
                combo.data.forEach(p => {
                    if (p.danoTotal < gMinY) gMinY = p.danoTotal;
                    if (p.danoTotal > gMaxY) gMaxY = p.danoTotal;
                });
            }
        });
        
        // Fallback de segurança se não tiver nenhum gráfico
        if (gMinX === 9999) { gMinX = 0; gMaxX = 20; gMinY = 0; gMaxY = 100; }
        
        // Aplica o "Respiro de Margem" idêntico ao do PowerShell
        let axisMinX = gMinX - 2; if (axisMinX < 0) axisMinX = 0;
        let axisMaxX = gMaxX + 2;
        let axisMinY = Math.floor(gMinY / 5) * 5 - 5; if (axisMinY < 0) axisMinY = 0;
        let axisMaxY = Math.ceil(gMaxY / 5) * 5 + 5;
        
        // Aplica as Travas de Intervalo (Grades simétricas)
        let yRange = axisMaxY - axisMinY;
        let yStep = 1;
        if (yRange > 300) yStep = 50; else if (yRange > 150) yStep = 20; else if (yRange > 80) yStep = 10; else if (yRange > 40) yStep = 5;
        
        let xRange = axisMaxX - axisMinX;
        let xStep = 1;
        if (xRange > 100) xStep = 10; else if (xRange > 50) xStep = 5; else if (xRange > 25) xStep = 2;

        // 2. INJEÇÃO DOS PONTOS FANTASMAS E SUSTENTAÇÃO BALÍSTICA
        const datasets = dmgActiveChartCombos.map(combo => {
            let pts = [];
            if (combo.data.length > 0) {
                pts.push({ x: axisMinX, y: combo.data[0].danoTotal, simulado: false, isFake: true });
                combo.data.forEach((p, index) => {
                    pts.push({ x: p.alcance, y: p.danoTotal, simulado: p.simulado, isFake: false });
                    if (index === 0) {
                        pts.push({ x: p.alcance + 0.99, y: p.danoTotal, simulado: false, isFake: true });
                    }
                });
                pts.push({ x: axisMaxX, y: combo.data[combo.data.length - 1].danoTotal, simulado: false, isFake: true });
            }
            
            return {
                label: combo.name,
                data: pts,
                borderColor: combo.color,
                backgroundColor: combo.color,
                pointStyle: combo.marker, 
                // Tamanho original era 6, caiu para 4px (64%)
                pointRadius: pts.map(p => p.isFake ? 0 : 4), 
                
                // Mira Hover original era 12, caiu para 8px (64%)
                pointHoverRadius: pts.map(p => p.isFake ? 0 : 8),
                pointHoverBorderWidth: 2,
                pointHoverBorderColor: '#FFFFFF',
                borderWidth: 2,
                tension: 0, 
                fill: false
            };
        });

        // --- A MÁGICA: RADAR CALIBRADO ---
        Chart.Interaction.modes.pointZoomCalibrado = function(chart, e, options, useFinalPosition) {
            const items = [];
            if (e.x === undefined || e.y === undefined) return items;
            
            // Como removemos o zoom global do CSS, o mouse agora opera em escala 1:1 nativa!
            const ZOOM_CSS = 1; 
            
            const mouseCalibradoX = e.x / ZOOM_CSS;
            const mouseCalibradoY = e.y / ZOOM_CSS;
            
            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                if (!meta.hidden) {
                    meta.data.forEach((element, index) => {
                        const pt = dataset.data[index];
                        if (pt && !pt.isFake && element.x !== undefined && element.y !== undefined) {
                            const distX = mouseCalibradoX - element.x;
                            const distY = mouseCalibradoY - element.y;
                            const distancia = Math.sqrt(distX * distX + distY * distY);
                            
                            // Hitbox restrito a 4px (Para bater com o tamanho reduzido da bolinha visual)
                            if (distancia <= 4) {
                                items.push({ element: element, datasetIndex: datasetIndex, index: index });
                            }
                        }
                    });
                }
            });
            return items;
        };

        // --- 3. O MOTOR DO NOVO BALÃO HTML (ESCALA 64%) ---
        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector('div.custom-tooltip');
            
            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.classList.add('custom-tooltip');
                Object.assign(tooltipEl.style, {
                    background: 'rgba(20, 20, 22, 0.98)',
                    borderRadius: '5px',
                    color: 'white',
                    opacity: 0,
                    pointerEvents: 'none',
                    position: 'absolute',
                    transition: 'opacity 0.15s ease, left 0.1s ease, top 0.1s ease', 
                    border: '1px solid #FFA500',
                    boxShadow: '0px 6px 16px rgba(0,0,0,0.8)',
                    padding: '10px',
                    zIndex: 999,
                    minWidth: '153px',
                    maxWidth: '90%', 
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                });
                chart.canvas.parentNode.appendChild(tooltipEl);
            }
            return tooltipEl;
        };

        const externalTooltipHandler = (context) => {
            const langT = translations[currentLang];
            const {chart, tooltip} = context;
            const tooltipEl = getOrCreateTooltip(chart);

            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            if (tooltip.body) {
                const validPoints = tooltip.dataPoints.filter(dp => dp.raw && !dp.raw.isFake);
                if (validPoints.length === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }

                const distance = validPoints[0].raw.x;
                
                let contentHTML = `
                    <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 5px; margin-bottom: 8px; text-align: center;">
                        <span style="color: #FFA500; font-size: 9px; font-weight: bold; letter-spacing: 1px;">📍 ${langT.dmgDynamicTexts.chartDistance.toUpperCase()}: <span style="font-size: 12px; color: white;">${distance}m</span></span>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                `;

                validPoints.forEach((dataPoint) => {
                    const pt = dataPoint.raw;
                    const isSimulated = pt.simulado;
                    const isInitial = (dataPoint.dataIndex === 1); 
                    const combo = dmgActiveChartCombos[dataPoint.datasetIndex];
                    
                    let tipoStr = langT.dmgDynamicTexts.chartTypeFinal;
                    let tipoColor = '#F44336'; 
                    
                    if (isInitial) {
                        tipoStr = langT.dmgDynamicTexts.chartTypeInitial;
                        tipoColor = '#4CAF50'; 
                    } else if (isSimulated) {
                        tipoStr = langT.dmgDynamicTexts.chartTypeSimulated;
                        tipoColor = '#FFC107'; 
                    }

                    const valDanoTotal = pt.y;
                    let wName = dataPoint.dataset.label;
                    let aName = "";
                    let aLvl = "";
                    
                    const regexMatch = wName.match(/^(.*?)\s*\((.*?)(?:\s*-\s*(.*))?\)$/);
                    if (regexMatch) {
                        wName = regexMatch[1].trim(); 
                        if (regexMatch[3]) {
                            aName = regexMatch[2].trim(); 
                            aLvl = regexMatch[3].trim();
                            const tLvl = translations[currentLang].lblLvl;
                            aLvl = aLvl.replace('Lv.', tLvl).replace('Nv.', tLvl);
                        } else {
                            aName = regexMatch[2].trim(); 
                        }
                    }

                    const weaponColor = combo.color || '#00BCD4';

                    let weaponBlockHTML = `
                        <div style="margin-bottom: 8px; border-left: 3px solid ${weaponColor}; padding-left: 6px; background: rgba(255, 255, 255, 0.05); padding-top: 5px; padding-bottom: 5px; border-radius: 0 3px 3px 0;">
                            <div style="font-size: 12px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px; text-transform: uppercase; line-height: 1;">${wName}</div>
                            ${aName ? `
                            <div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                                <span style="color: ${weaponColor}; font-size: 10px; font-weight: bold; line-height: 1;">${aName}</span>${aLvl ? `<span style="background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #e0e0e0; font-size: 10px; padding: 1px 3px; border-radius: 3px; font-weight: bold; line-height: 1;">${aLvl}</span>` : ''}
                            </div>` : ''}
                        </div>
                    `;
                    
                    let dmgDisplay = `<span style="font-size: 18px; font-weight: 900; color: #FFFFFF; text-shadow: 0 0 6px rgba(255,255,255,0.4);">${valDanoTotal}</span>`;
                    if (combo.pelletCount > 1) {
                        let porPellet = Math.round(valDanoTotal / combo.pelletCount);
                        dmgDisplay = `
                            <div style="text-align: right;">
                                <span style="font-size: 14px; font-weight: 900; color: #FFFFFF;">${porPellet}${combo.pelletText}</span><br>
                                <span style="font-size: 8px; color: #a0a0a0;">(Total: ${valDanoTotal})</span>
                            </div>`;
                    }

                    contentHTML += `
                        <div style="flex: 1; min-width: 128px; display: flex; flex-direction: column;">
                            ${weaponBlockHTML}
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; background: rgba(255,255,255,0.05); padding: 3px 5px; border-radius: 3px; border-left: 3px solid ${tipoColor};">
                                <span style="color: #a0a0a0; font-size: 7px; font-weight: bold; text-transform: uppercase;">${langT.dmgDynamicTexts.chartType}</span>
                                <span style="color: ${tipoColor}; font-size: 8px; font-weight: 900; letter-spacing: 1px;">${tipoStr}</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 5px 6px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); margin-top: auto;">
                                <span style="color: #e0e0e0; font-size: 8px; font-weight: bold;">${langT.dmgDynamicTexts.damageText}:</span>
                                ${dmgDisplay}
                            </div>
                        </div>
                    `;
                });

                contentHTML += `</div>`; 
                tooltipEl.innerHTML = contentHTML;
            }

            const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
            const tooltipWidth = tooltipEl.offsetWidth;
            const tooltipHeight = tooltipEl.offsetHeight;
            const chartWidth = chart.width;
            const chartHeight = chart.height;

            let finalLeft = positionX + tooltip.caretX - (tooltipWidth / 2);
            let finalTop = positionY + tooltip.caretY + 10;

            if ((finalTop + tooltipHeight) > (positionY + chartHeight)) {
                finalTop = positionY + tooltip.caretY - tooltipHeight - 10;
            }

            if (finalLeft < positionX) {
                finalLeft = positionX + 10;
            } else if ((finalLeft + tooltipWidth) > (positionX + chartWidth)) {
                finalLeft = positionX + chartWidth - tooltipWidth - 10;
            }

            tooltipEl.style.left = finalLeft + 'px';
            tooltipEl.style.top = finalTop + 'px';
            tooltipEl.style.opacity = 1;
        };

        // 4. O DESENHISTA FINAL
        dmgChartInstance = new Chart(ctx, {
            type: 'line',
            data: { datasets: datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'pointZoomCalibrado',   
                    intersect: false, 
                },
                layout: { padding: { top: 13, bottom: 13 } },
                plugins: {
                    zoom: {
                        limits: { 
                            x: { min: axisMinX, max: axisMaxX, minRange: xStep * 4 }, 
                            y: { min: axisMinY, max: axisMaxY, minRange: yStep * 4 }  
                        },
                        zoom: { 
                            wheel: { enabled: true, speed: 0.1 }, 
                            pinch: { enabled: true }, 
                            mode: (xRange <= 50) ? 'y' : 'xy' 
                        },
                        pan: { 
                            enabled: true, 
                            mode: (xRange <= 50) ? 'y' : 'xy',
                            onPanStart: function({chart}) { chart.canvas.style.cursor = 'grabbing'; },
                            onPanComplete: function({chart}) { chart.canvas.style.cursor = 'default'; }
                        }
                    },
                    legend: {
                        position: 'top',
                        padding: { bottom: 50 },
                        labels: { color: '#e0e0e0', font: { size: 10, family: 'Segoe UI', weight: 'bold' }, usePointStyle: true, padding: 16 }
                    },
                    tooltip: {
                        enabled: false, 
                        external: externalTooltipHandler
                    }
                },
                scales: {
                    x: {
                        type: 'linear', min: axisMinX, max: axisMaxX, 
                        title: { display: true, text: t.dmgDynamicTexts.axisDistance, color: '#FFA500', font: { size: 12, weight: 'bold', family: 'Segoe UI' }, padding: { top: 16, bottom: 6 } },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        ticks: { 
                            stepSize: xStep, maxRotation: -90, minRotation: -90, color: '#a0a0a0', font: { size: 9, weight: 'normal', family: 'Segoe UI' }, padding: 29, z: 10,
                            callback: function(value) { return Number.isInteger(value) ? String(value).split('').join('\u200A') : null; }
                        }
                    },
                    y: {
                        min: axisMinY, max: axisMaxY, 
                        title: { display: true, text: t.dmgDynamicTexts.axisDamage, color: '#FFA500', font: { size: 12, weight: 'bold', family: 'Segoe UI' }, padding: { bottom: 25, top: 6 } },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        ticks: { 
                            stepSize: yStep, color: '#a0a0a0', font: { size: 9, weight: 'normal', family: 'Segoe UI' }, padding: 13, z: 10,
                            callback: function(value) { return Number.isInteger(value) ? String(value).split('').join('\u200A') : null; }
                        }
                    }
                }
            }
        });
    } else if (dmgChartInstance) {
        // CORREÇÃO DOS TÍTULOS DOS EIXOS: Atualiza silenciosamente os títulos dos eixos X e Y sem perder o Zoom!
        dmgChartInstance.options.scales.x.title.text = t.dmgDynamicTexts.axisDistance;
        dmgChartInstance.options.scales.y.title.text = t.dmgDynamicTexts.axisDamage;
        dmgChartInstance.update('none'); // Faz a atualização visual sem animar
    }
}

// =====================================================================
// NOVO MOTOR DE COMPATIBILIDADE DE MÁSCARAS (DESIGN EM CARDS)
// =====================================================================

function getMaskCompatibilityData() {
    const maskClasses = {};
    if (db.masks) {
        db.masks.forEach(m => { maskClasses[m.NomeItem] = m.ClasseBlindagem || "N/A"; });
    }

    const helmetClasses = {};
    if (db.helmets) {
        db.helmets.forEach(h => { helmetClasses[h.NomeItem] = h.ClasseBlindagem || "?"; });
    }

    const results = [];
    if (!db.maskCompatibility) return results;

    db.maskCompatibility.forEach(row => {
        const maskName = row.MaskName || "";
        if (!maskName) return;

        let armorClass = "N/A";
        let armorClassNum = 0;
        
        if (maskClasses[maskName]) {
            armorClass = maskClasses[maskName];
            let numMatch = String(armorClass).match(/\d+/);
            if (numMatch) armorClassNum = parseInt(numMatch[0], 10);
        }

        let helmetObjs = [];
        let maxHelmetClass = 0;

        if (row.CompatibleHelmets && row.CompatibleHelmets.trim() !== "") {
            const rawHelmets = row.CompatibleHelmets.split(',');
            
            rawHelmets.forEach(hName => {
                const hNameTrimmed = hName.trim();
                if (!hNameTrimmed) return;
                
                let hClass = "?";
                let hClassNum = 0;

                if (helmetClasses[hNameTrimmed]) {
                    hClass = helmetClasses[hNameTrimmed];
                    let hNumMatch = String(hClass).match(/\d+/);
                    if (hNumMatch) hClassNum = parseInt(hNumMatch[0], 10);
                }

                if (hClassNum > maxHelmetClass) maxHelmetClass = hClassNum;

                // Agora salvamos os dados puros para montar as etiquetas (Badges)
                helmetObjs.push({
                    Nome: hNameTrimmed,
                    ClasseStr: hClass,
                    Nivel: hClassNum
                });
            });
        }

        helmetObjs.sort((a, b) => b.Nivel - a.Nivel); // Ordena os capacetes do mais forte pro mais fraco

        results.push({
            MaskName: maskName,
            ClasseStr: armorClass,
            ClasseNum: armorClassNum,
            MaxHelmetClass: maxHelmetClass,
            HelmetsArray: helmetObjs // Mandamos a lista rica para o desenhista!
        });
    });

    results.sort((a, b) => {
        if (b.ClasseNum !== a.ClasseNum) return b.ClasseNum - a.ClasseNum;
        return b.MaxHelmetClass - a.MaxHelmetClass;
    });

    return results;
}

// =====================================================================
// SISTEMA DE FILTRO EXCLUSIVO DE MÁSCARAS E CAPACETES (UNIFICADO)
// =====================================================================

let activeMaskFilters = [];
let tempMaskFilters = [];

function openMaskFilterModal() {
    tempMaskFilters = [...activeMaskFilters];
    
    const container = document.getElementById('unified-mask-filter-opts');
    container.innerHTML = '';
    
    // 1. Escaneia dinamicamente o banco para achar apenas classes reais (Ignora o S/Classe)
    const classesExistentes = new Set();
    const rawData = getMaskCompatibilityData();
    
    rawData.forEach(mask => {
        if (mask.ClasseNum > 0) classesExistentes.add(mask.ClasseNum);
        if (mask.HelmetsArray) {
            mask.HelmetsArray.forEach(h => {
                if (h.Nivel > 0) classesExistentes.add(h.Nivel);
            });
        }
    });

    // 2. Ordena numericamente (ex: 1, 2, 3...)
    const sortedClasses = Array.from(classesExistentes).sort((a, b) => a - b);

    // 3. Monta apenas os checkboxes das classes que realmente existem!
    sortedClasses.forEach(classNum => {
        const label = document.createElement('label');
        label.className = 'filter-checkbox-label';
        
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        
        if (tempMaskFilters.includes(classNum)) {
            cb.checked = true;
            label.classList.add('state-M'); 
        } else {
            label.classList.add('state-F'); 
        }
        
        cb.addEventListener('change', () => {
            if (cb.checked) {
                tempMaskFilters.push(classNum);
                label.classList.replace('state-F', 'state-M');
            } else {
                tempMaskFilters = tempMaskFilters.filter(v => v !== classNum);
                label.classList.replace('state-M', 'state-F');
            }
        });
        
        label.appendChild(cb);
        
        label.appendChild(document.createTextNode(translations[currentLang].lblClassSpace + classNum));
        
        container.appendChild(label);
    });
    
    document.getElementById('mask-filter-overlay').classList.remove('hidden-section');
}

function resetMaskFilters() {
    tempMaskFilters = []; // Zera a memória temporária
    
    // Varre o painel e desmarca todas as caixas visualmente
    const checkboxes = document.querySelectorAll('#unified-mask-filter-opts input[type="checkbox"]');
    const labels = document.querySelectorAll('#unified-mask-filter-opts .filter-checkbox-label');
    
    checkboxes.forEach(cb => cb.checked = false);
    labels.forEach(label => {
        label.classList.remove('state-M');
        label.classList.add('state-F');
    });
}

function applyMaskFilters() {
    activeMaskFilters = [...tempMaskFilters];
    document.getElementById('mask-filter-overlay').classList.add('hidden-section');
    
    const btn = document.getElementById('btn-mask-filter');
    const btnReset = document.getElementById('btn-mask-reset-quick'); // Captura o botão novo
    
    if (activeMaskFilters.length > 0) {
        // Filtros ATIVOS: Botão laranja fica aceso e Botão de Reset APARECE
        btn.classList.add('btn-filter-active');
        btn.style.backgroundColor = 'var(--orange-accent)';
        btn.style.color = 'var(--background)';
        if (btnReset) btnReset.style.display = 'block'; 
    } else {
        // Filtros ZERADOS: Botão volta ao normal e Botão de Reset SOME
        btn.classList.remove('btn-filter-active');
        btn.style.backgroundColor = 'var(--button-back)';
        btn.style.color = 'var(--orange-accent)';
        if (btnReset) btnReset.style.display = 'none'; 
    }

    renderMaskCompatibilityUI(); 
}

function quickResetMaskFilters() {
    activeMaskFilters = []; // Zera a memória global
    tempMaskFilters = []; // Zera a memória do modal
    applyMaskFilters(); // Usa a própria função de aplicar para apagar o botão da tela e redesenhar os cards!
}

// A FUNÇÃO RENDERIZADORA COM A TRILHA DE "TESOURAS"
function renderMaskCompatibilityUI() {
    const container = document.getElementById('mask-comp-container');
    
    if (!container) return;
    container.innerHTML = ''; 
    
    const rawData = getMaskCompatibilityData();
    if (rawData.length === 0) return;
    
    rawData.forEach(mask => {
        // TESOURA 1: A própria máscara pertence a uma classe banida? Se sim, destrói o card!
        if (activeMaskFilters.includes(mask.ClasseNum)) return;
        
        let helmetsHTML = '';
        let visibleHelmetsCount = 0;
        let totalHelmets = mask.HelmetsArray ? mask.HelmetsArray.length : 0;

        if (totalHelmets > 0) {
            mask.HelmetsArray.forEach(h => {
                // TESOURA 2: O capacete pertence a uma classe banida? Se sim, ele não entra na lista.
                if (activeMaskFilters.includes(h.Nivel)) return; 
                
                visibleHelmetsCount++;
                let hLevel = h.Nivel > 6 ? 6 : h.Nivel;
                const hBadgeColor = `badge-cl-${hLevel}`;
                
                helmetsHTML += `
                    <div class="helmet-row">
                        <span class="helmet-name">${h.Nome}</span>
                        <span class="badge-class ${hBadgeColor}">Cl. ${h.ClasseStr}</span>
                    </div>
                `;
            });
        } 
        
        // TESOURA 3: A máscara tinha capacetes, mas os filtros esconderam todos eles? Se sim, oculta o card!
        if (totalHelmets > 0 && visibleHelmetsCount === 0) {
            return; 
        }

        // Regra natural: A máscara já não tinha capacetes originalmente no CSV
        if (totalHelmets === 0) {
            const t = translations[currentLang];
            helmetsHTML = `<div style="text-align: center; color: var(--text-dim); padding: 15px; font-style: italic;">${t.msgCompatibleHelmetsEmpty}</div>`;
        }

        const card = document.createElement('div');
        card.className = 'mask-card';
        
        let maskLevel = mask.ClasseNum > 6 ? 6 : mask.ClasseNum;
        const maskBadgeColor = `badge-cl-${maskLevel}`;

        card.innerHTML = `
            <div class="mask-card-header">
                <span class="mask-card-title">${mask.MaskName}</span>
                <span class="badge-class ${maskBadgeColor}">Cl. ${mask.ClasseStr}</span>
            </div>
            <div class="mask-card-body">
                ${helmetsHTML}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// =====================================================================
// 7. MOTOR DE ARTIGOS E CHANGELOG (MARKDOWN PARSER INTELIGENTE)
// =====================================================================

function parseMarkdownToHTML(mdText) {
    const renderer = new marked.Renderer();
    
    renderer.code = function(token) {
        const codeText = typeof token === 'object' ? token.text : token;
        
        // MÁGICA DE ALINHAMENTO ABSOLUTO:
        // Agora nós travamos a fonte "Courier New" e o comportamento de espaços ("white-space: pre") 
        // diretamente na tag <code> para nenhuma outra regra do site interferir.
        return `<pre style="background-color: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 6px; overflow-x: auto; margin: 15px 0;"><code style="font-family: 'Courier New', Courier, monospace; color: var(--orange-accent); white-space: pre; font-size: 1.1rem; line-height: 1.5; display: block;">${codeText}</code></pre>`;
    };
    
    marked.setOptions({
        breaks: true, 
        gfm: true,    
        renderer: renderer 
    });
    
    const htmlGerado = marked.parse(mdText);
    return `<div class="markdown-body">${htmlGerado}</div>`;
}

// ---------------------------------------------------------
// MOTOR DO CHANGELOG
// ---------------------------------------------------------

// --- NOVO: Conversor Inteligente de Datas ---
function formatChangelogDate(dateStr) {
    // Tenta quebrar a string assumindo que você escreve no formato brasileiro DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        // Se o idioma for Inglês, converte para o formato Americano (MM/DD/YYYY)
        if (currentLang === 'en') {
            return `${month}/${day}/${year}`;
        }
        // Se for Português, mantém a ordem original (DD/MM/YYYY)
        return `${day}/${month}/${year}`;
    }
    // Se a data estiver em um formato desconhecido (ex: "Agosto de 2026"), deixa como está
    return dateStr;
}

async function loadChangelog() {
    const contentArea = document.getElementById('changelog-content-area');
    const dateLabel = document.getElementById('nav-changelog-date');
    const t = translations[currentLang];
    
    try {
        const response = await fetch('changelog.md');
        if (!response.ok) throw new Error("Changelog não encontrado.");
        
        const rawText = await response.text();
        const lines = rawText.split('\n');
        
        let dateText = lines[0].trim();
        dateText = dateText.replace(/^#+ /, ''); 
        
        const dataFormatada = formatChangelogDate(dateText);
        
        // MUDANÇA 1: Usando o dicionário para "Atualizado:"
        if (dateLabel) {
            dateLabel.textContent = `${t.lblUpdated} ${dataFormatada}`;
        }
        
        const contentText = lines.slice(2).join('\n').trim();
        
        if (contentArea) {
            contentArea.innerHTML = parseMarkdownToHTML(contentText);
            if (window.MathJax) { MathJax.typesetPromise(); }
        }
        
    } catch (error) {
        console.error(error);
        if (contentArea) {
            contentArea.innerHTML = `<div style="color: var(--fail); text-align: center; margin-top: 100px; font-weight: bold;">${t.lblChangelogError}</div>`;
        }
        // MUDANÇA 2: Usando o dicionário para o erro de leitura na barra lateral
        if (dateLabel) {
            dateLabel.textContent = t.lblChangelogError;
        }
    }
}

// MÁGICA TÁTICA: Lê a data do changelog ocultamente 1.5s após o app abrir
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadChangelog, 1500); 
});

// ---------------------------------------------------------
// MOTOR DE ARTIGOS
// ---------------------------------------------------------
let articlesIndex = [];
let currentArticleId = null;

async function initArticlesEngine() {
    if (articlesIndex.length > 0) {
        renderArticlesMenu();
        return;
    }
    
    try {
        // Busca a sua lista de artigos (O "Catálogo")
        const response = await fetch('articles/index_artigos.json');
        if (!response.ok) throw new Error("Index de artigos não encontrado.");
        
        articlesIndex = await response.json();
        renderArticlesMenu();
        
    } catch (error) {
        console.error("Erro ao carregar o índice de artigos:", error);
        const menuContainer = document.getElementById('articles-menu-container');
        if (menuContainer) {
            menuContainer.innerHTML = `<div style="color: var(--fail); padding: 10px; font-size: 0.9em; text-align: center;">O arquivo 'index_artigos.json' não foi encontrado na pasta 'articles'.</div>`;
        }
    }
}

function renderArticlesMenu() {
    const menuContainer = document.getElementById('articles-menu-container');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    // Variável para saber se o artigo que eu estava lendo sumiu ao trocar de idioma
    let isCurrentArticleStillVisible = false;
    
    articlesIndex.forEach(art => {
        // --- INÍCIO DA TÁTICA B ---
        // Se o artigo tiver a trava "langOnly" e ela for diferente do idioma atual, aborta a criação!
        if (art.langOnly && art.langOnly !== currentLang) {
            return; 
        }
        // --- FIM DA TÁTICA B ---
        
        // Se o código chegou até aqui, significa que o artigo é válido e vai aparecer na tela
        if (currentArticleId === art.id) {
            isCurrentArticleStillVisible = true;
        }
        
        const btn = document.createElement('button');
        
        // --- PADRONIZAÇÃO DE CORES: Busca de Itens ---
        btn.className = 'article-menu-btn';
        btn.style.padding = '30px 20px'; 
        btn.style.fontSize = '1.2rem';
        btn.style.fontWeight = 'bold';
        btn.style.color = 'var(--text-main)';
        btn.style.border = '1px solid var(--orange-accent)'; // Borda laranja padrão
        btn.style.borderRadius = '4px'; // Borda levemente arredondada (padrão do site)
        btn.style.textAlign = 'center';
        btn.style.backgroundColor = 'var(--button-back)'; // Fundo cinza padrão
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        
        // --- A MÁGICA DOS IDIOMAS INFINITOS ---
        // Ele monta a palavra dinamicamente. Se for 'es', ele busca 'titleEs'. 
        // Se der erro ou não achar no JSON, ele cai pro Inglês (Fallback Seguro).
        const langKey = 'title' + currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
        btn.textContent = art[langKey] ? art[langKey] : art.titleEn;
        
        // Efeito de Mouse-Over elegante
        btn.onmouseover = () => { 
            btn.style.backgroundColor = 'var(--button-hover)'; // Fica mais claro ao passar o mouse
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
        };
        btn.onmouseout = () => { 
            btn.style.backgroundColor = 'var(--button-back)'; // Volta ao fundo cinza original
            btn.style.transform = 'none';
            btn.style.boxShadow = 'none';
        };
        
        btn.onclick = () => {
            currentArticleId = art.id;
            loadArticleContent(art.file); // Carrega a leitura
        };
        
        menuContainer.appendChild(btn);
    });
    
    // Tratamento de segurança: Se eu estava lendo um artigo em PT, mudei para EN e ele não existe lá...
    if (currentArticleId !== null && !isCurrentArticleStillVisible) {
        closeArticleView(); // Força a volta pra lista se o artigo sumiu na tradução
    }
}

// --- NOVO: FUNÇÃO QUE FECHA O ARTIGO E VOLTA PRA VITRINE ---
function closeArticleView() {
    currentArticleId = null;
    document.getElementById('articles-content-view').classList.add('hidden-section');
    document.getElementById('btn-articles-back').classList.add('hidden-section');
    document.getElementById('articles-menu-view').classList.remove('hidden-section');
    document.getElementById('article-content-area').innerHTML = ''; // Limpa o texto da memória
}

async function loadArticleContent(filename) {
    const contentArea = document.getElementById('article-content-area');
    const t = translations[currentLang];
    
    // MÁGICA DE TRANSIÇÃO: Esconde a Vitrine e Exibe a Leitura + Botão Voltar
    document.getElementById('articles-menu-view').classList.add('hidden-section');
    document.getElementById('articles-content-view').classList.remove('hidden-section');
    document.getElementById('btn-articles-back').classList.remove('hidden-section');
    
    contentArea.innerHTML = `<div style="color: var(--text-dim); text-align: center; margin-top: 100px; font-style: italic;">${t.lblAboutLoading}</div>`;
    
    try {
        // MÁGICA BILÍNGUE: Procura primeiro na subpasta do idioma! (ex: articles/pt/dano.md)
        const filePath = `articles/${currentLang}/${filename}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
            // Plano B: Se não achar a pasta /pt/ ou /en/, tenta pegar o arquivo solto na pasta principal
            const fallbackResponse = await fetch(`articles/${filename}`);
            if (!fallbackResponse.ok) throw new Error(`Article not found: ${filename}`);
            
            const fallbackText = await fallbackResponse.text();
            contentArea.innerHTML = parseMarkdownToHTML(fallbackText);
            // ADICIONE AQUI: Avisa o MathJax no Plano B
            if (window.MathJax) { MathJax.typesetPromise(); }
            return;
        }
        
        const rawText = await response.text();
        contentArea.innerHTML = parseMarkdownToHTML(rawText);
        // ADICIONE AQUI: Avisa o MathJax no Plano A
        if (window.MathJax) { MathJax.typesetPromise(); }
        
    } catch (error) {
        console.error(error);
        contentArea.innerHTML = `<div style="color: var(--fail); text-align: center; margin-top: 100px; font-weight: bold;">${t.lblArticlesError}</div>`;
    }
}

// ---------------------------------------------------------
// MOTOR DO "SOBRE A FERRAMENTA" (CARTA DO DESENVOLVEDOR)
// ---------------------------------------------------------
async function loadAboutContent() {
    const contentArea = document.getElementById('about-content-area');
    const t = translations[currentLang];
    
    if (!contentArea) return;
    
    // Mostra "Carregando" na tela com o idioma correto enquanto busca o arquivo
    contentArea.innerHTML = `<div style="color: var(--text-dim); text-align: center; margin-top: 100px;">${t.lblAboutLoading}</div>`;
    
    try {
        // --- A MÁGICA DA NEUTRALIDADE ---
        // Ele pergunta ao dicionário atual o nome do arquivo. Se o JSON não tiver essa informação, cai para o Inglês.
        const filename = t.aboutFileName ? t.aboutFileName : 'about.md';
        
        // Caminho ideal: procura direto na subpasta do idioma!
        const filePath = `articles/${currentLang}/${filename}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
            // PLANO B (Fallback): Se preferiu colocar os arquivos soltos na raiz 'articles'
            const fallbackResponse = await fetch(`articles/${filename}`);
            if (!fallbackResponse.ok) throw new Error(`Arquivo não encontrado: ${filename}`);
            
            const fallbackText = await fallbackResponse.text();
            contentArea.innerHTML = parseMarkdownToHTML(fallbackText);
            return;
        }
        
        // Se achou o arquivo de primeira, traduz o Markdown
        const rawText = await response.text();
        contentArea.innerHTML = parseMarkdownToHTML(rawText);
        
    } catch (error) {
        console.error("Erro no loadAboutContent:", error);
        contentArea.innerHTML = `<div style="color: var(--fail); text-align: center; margin-top: 100px; font-weight: bold;">${t.lblAboutError}</div>`;
    }
}

// =====================================================================
// 8. SIMULADOR DE COMBATE (ARMA + MUNIÇÃO VS COLETE/CAPACETE/MÁSCARA)
// =====================================================================

function initCombatSimulator() {
    const cbClass = document.getElementById('sim-cb-class');
    const cbArmorType = document.getElementById('sim-cb-armor-type');
    const cbArmor = document.getElementById('sim-cb-armor');
    
    if (!cbClass) return;
    
    const oldClass = cbClass.value;
    const oldArmorType = cbArmorType ? cbArmorType.value : "";
    const oldArmor = cbArmor ? cbArmor.value : "";
    
    const t = translations[currentLang];
    
    // Fallbacks Neutros
    const txtClass = (t.simDynamicTexts && t.simDynamicTexts.selectClass) ? t.simDynamicTexts.selectClass : 'Select Class...';
    const txtArmor = (t.simDynamicTexts && t.simDynamicTexts.selectArmor) ? t.simDynamicTexts.selectArmor : 'Select Protection...';
    
    // --- Popula Classes de Arma ---
    cbClass.innerHTML = `<option value="" disabled ${!oldClass ? 'selected' : ''} hidden>${txtClass}</option>`;
    
    const weaponsWithData = new Set(db.damageData.map(d => d.Arma));
    const filteredWeps = db.weapons.filter(w => weaponsWithData.has(w.NomeItem));
    let uniqueClassesMap = new Map();
    
    filteredWeps.forEach(w => {
        let catName = currentLang !== 'en' ? traduzirDado('weapons', 'Classe', w.Classe) : w.Classe;
        if (w.Classe) uniqueClassesMap.set(w.Classe, catName);
    });

    const sortedRawClasses = Array.from(uniqueClassesMap.keys()).sort((a, b) => {
        return uniqueClassesMap.get(a).localeCompare(uniqueClassesMap.get(b));
    });

    sortedRawClasses.forEach(rawCls => {
        let opt = document.createElement('option');
        opt.value = rawCls; 
        opt.textContent = uniqueClassesMap.get(rawCls); 
        cbClass.appendChild(opt);
    });

    if (oldClass) {
        cbClass.value = oldClass;
    }

    // --- Lógica de Restauração da Armadura via Filtro Mestre ---
    if (cbArmorType && oldArmorType) {
        cbArmorType.value = oldArmorType;
        simArmorTypeSelected(oldArmorType, oldArmor);
    } else if (cbArmor) {
        cbArmor.innerHTML = `<option value="" disabled selected hidden>${txtArmor}</option>`;
        cbArmor.disabled = true;
        cbArmor.style.opacity = '0.5';
        cbArmor.style.cursor = 'not-allowed';
    }
}

function simChangeClass(classRaw, isLangRefresh = false) {
    const cbWeapon = document.getElementById('sim-cb-weapon');
    const cbAmmo = document.getElementById('sim-cb-ammo');
    
    const t = translations[currentLang];
    
    // Fallbacks Neutros
    const txtWep = (t.simDynamicTexts && t.simDynamicTexts.selectWeapon) ? t.simDynamicTexts.selectWeapon : 'Select Weapon...';
    const txtAmmo = (t.simDynamicTexts && t.simDynamicTexts.selectAmmo) ? t.simDynamicTexts.selectAmmo : 'Select Ammo...';
    
    const oldWep = isLangRefresh ? cbWeapon.value : "";
    
    cbWeapon.innerHTML = `<option value="" disabled ${!oldWep ? 'selected' : ''} hidden>${txtWep}</option>`;
    
    if (!isLangRefresh) {
        cbAmmo.innerHTML = `<option value="" disabled selected hidden>${txtAmmo}</option>`;
        cbAmmo.disabled = true;
        cbAmmo.style.opacity = '0.5';
        cbAmmo.style.cursor = 'not-allowed';
    }
    
    cbWeapon.disabled = true;
    cbWeapon.style.opacity = '0.5';
    cbWeapon.style.cursor = 'not-allowed';
    
    if (!classRaw) return;
    
    const weaponsWithData = new Set(db.damageData.map(d => d.Arma));
    const filteredWeps = db.weapons.filter(w => weaponsWithData.has(w.NomeItem));
    
    let wepsInClass = filteredWeps.filter(w => w.Classe === classRaw).sort((a, b) => a.NomeItem.localeCompare(b.NomeItem));

    wepsInClass.forEach(w => {
        let cal = w.Calibre ? w.Calibre : "N/A";
        let opt = document.createElement('option');
        opt.value = w.NomeItem; 
        opt.textContent = `${w.NomeItem} (${cal})`; 
        if (isLangRefresh && w.NomeItem === oldWep) opt.selected = true;
        cbWeapon.appendChild(opt);
    });
    
    cbWeapon.disabled = false;
    cbWeapon.style.opacity = '1';
    cbWeapon.style.cursor = 'pointer';
    
    if (isLangRefresh && oldWep) {
        simChangeWeapon(oldWep, true);
    }
}

function simChangeWeapon(weaponName, isLangRefresh = false) {
    const cbAmmo = document.getElementById('sim-cb-ammo');
    
    const t = translations[currentLang];
    
    // Fallback Neutro
    const txtAmmo = (t.simDynamicTexts && t.simDynamicTexts.selectAmmo) ? t.simDynamicTexts.selectAmmo : 'Select Ammo...';
    
    const oldAmmo = isLangRefresh ? cbAmmo.value : "";
    
    cbAmmo.innerHTML = `<option value="" disabled ${!oldAmmo ? 'selected' : ''} hidden>${txtAmmo}</option>`;
    
    cbAmmo.disabled = true;
    cbAmmo.style.opacity = '0.5';
    cbAmmo.style.cursor = 'not-allowed';
    
    if (!weaponName) return;
    
    const dmgRows = db.damageData.filter(d => d.Arma === weaponName);
    const ammoNames = Array.from(new Set(dmgRows.map(d => d["nome da munição"])));
    
    let dmgInfo = db.damageData.find(d => d.Arma === weaponName);
    let cal = dmgInfo ? dmgInfo.Calibre : null;
    
    let ammoList = [];
    
    ammoNames.forEach(aName => {
        let ammoRow = db.ammo.find(a => a.NomeItem === aName && a.Calibre === cal); 
        
        let lvlNum = 99;
        let lvlDisplay = "?";
        let pen = 0;
        if (ammoRow && ammoRow.NivelPenetracao) {
            lvlNum = parseInt(ammoRow.NivelPenetracao, 10);
            lvlDisplay = `${translations[currentLang].lblLvl}${ammoRow.NivelPenetracao}`;
            pen = parseInt(ammoRow.Penetracao || 0, 10);
        }
        
        ammoList.push({
            name: aName,
            lvlNum: isNaN(lvlNum) ? 99 : lvlNum,
            pen: pen,
            display: `[${lvlDisplay}] ${aName}`
        });
    });
    
    ammoList.sort((a, b) => {
        if (a.lvlNum !== b.lvlNum) return b.lvlNum - a.lvlNum; 
        if (a.pen !== b.pen) return b.pen - a.pen;
        return a.name.localeCompare(b.name);
    });
    
    ammoList.forEach(aObj => {
        let opt = document.createElement('option');
        opt.value = aObj.name;
        opt.textContent = aObj.display;
        if (isLangRefresh && aObj.name === oldAmmo) opt.selected = true;
        cbAmmo.appendChild(opt);
    });
    
    if (ammoList.length > 0) {
        cbAmmo.disabled = false;
        cbAmmo.style.opacity = '1';
        cbAmmo.style.cursor = 'pointer';
    }
    
    simRunCombatCalculation();
}

// =======================================================
// FILTRO MESTRE DE CATEGORIA DE ARMADURA
// =======================================================
function simArmorTypeSelected(typeValue, oldArmorToRestore = "") {
    const cbArmor = document.getElementById('sim-cb-armor');
    const sliderContainer = document.getElementById('sim-durability-control');
    if (sliderContainer) sliderContainer.style.display = 'none'; 
    
    const t = translations[currentLang];
    
    // Fallback Neutro
    const txtArmor = (t.simDynamicTexts && t.simDynamicTexts.selectArmor) ? t.simDynamicTexts.selectArmor : 'Select Protection...';
    
    if (!typeValue) {
        cbArmor.innerHTML = `<option value="" disabled selected hidden>${txtArmor}</option>`;
        cbArmor.disabled = true;
        cbArmor.style.opacity = '0.5';
        cbArmor.style.cursor = 'not-allowed';
        return;
    }
    
    cbArmor.innerHTML = `<option value="" disabled ${!oldArmorToRestore ? 'selected' : ''} hidden>${txtArmor}</option>`;
    
    let list = [];
    
    if (typeValue === "Helmets" && db.helmets) {
        list = db.helmets.map(a => ({...a, type: 'helmets'}));
    } else if (typeValue === "Masks" && db.masks) {
        list = db.masks.map(a => ({...a, type: 'masks'}));
    } else if (typeValue === "BodyArmor" && db.bodyArmor) {
        list = db.bodyArmor.map(a => ({...a, type: 'bodyArmor'}));
    } else if (typeValue === "ArmoredRigs" && db.armoredRigs) {
        list = db.armoredRigs.map(a => ({...a, type: 'armoredRigs'}));
    } else if (typeValue === "AllArmors") {
        if (db.bodyArmor) list = list.concat(db.bodyArmor.map(a => ({...a, type: 'bodyArmor'})));
        if (db.armoredRigs) list = list.concat(db.armoredRigs.map(a => ({...a, type: 'armoredRigs'})));
    }
    
    list = list.filter(a => a.ClasseBlindagem && a.ClasseBlindagem !== "/////" && parseInt(a.ClasseBlindagem) > 0);
    
    list.sort((a, b) => {
        const ca = parseInt(a.ClasseBlindagem);
        const cb = parseInt(b.ClasseBlindagem);
        if (ca !== cb) return cb - ca;
        return a.NomeItem.localeCompare(b.NomeItem);
    });
    
    list.forEach(item => {
        let opt = document.createElement('option');
        opt.value = `${item.type}|${item.NomeItem}`; 
        opt.textContent = `[${translations[currentLang].lblLvl}${item.ClasseBlindagem}] ${item.NomeItem}`; 
        cbArmor.appendChild(opt);
    });
    
    cbArmor.disabled = false;
    cbArmor.style.opacity = '1';
    cbArmor.style.cursor = 'pointer';
    
    if (oldArmorToRestore) {
        cbArmor.value = oldArmorToRestore;
        simArmorSelected();
    } else {
        simRunCombatCalculation();
    }
}

function simArmorSelected() {
    const cbArmor = document.getElementById('sim-cb-armor');
    const sliderContainer = document.getElementById('sim-durability-control');
    const slider = document.getElementById('sim-range-dur');
    const lblCurrent = document.getElementById('sim-lbl-current-dur');
    
    if (!cbArmor.value) {
        if(sliderContainer) sliderContainer.style.display = 'none';
        return;
    }
    
    const armorVal = cbArmor.value;
    const [armorType, armorName] = armorVal.split('|');
    let armorRow = db[armorType] ? db[armorType].find(a => a.NomeItem === armorName) : null;
    
    if (armorRow && armorRow.Durabilidade) {
        let maxDur = parseFloat(armorRow.Durabilidade);
        if(slider) {
            slider.max = maxDur;
            slider.value = maxDur;
            sliderContainer.style.display = 'flex';
            lblCurrent.textContent = maxDur + " / " + maxDur + " (100%)";
        }
    }
    
    simRunCombatCalculation();
}

// =======================================================
// O MOTOR DE CÁLCULO PRINCIPAL DO SIMULADOR
// =======================================================
function simRunCombatCalculation() {
    const cbWeapon = document.getElementById('sim-cb-weapon');
    const cbAmmo = document.getElementById('sim-cb-ammo');
    const cbArmor = document.getElementById('sim-cb-armor');
    
    const panelResult = document.getElementById('sim-result-panel');
    const containerResult = document.getElementById('sim-result-container');
    const placeholderText = document.getElementById('sim-placeholder-text');
    
    const t = translations[currentLang];
    
    if (!cbWeapon || !cbAmmo || !cbArmor) return;
    
    const wName = cbWeapon.value;
    const aName = cbAmmo.value;
    const armorVal = cbArmor.value;
    
    if (!wName || !aName || !armorVal) {
        panelResult.style.opacity = '0.5';
        panelResult.style.borderColor = 'var(--button-hover)';
        containerResult.style.display = 'none';
        placeholderText.style.display = 'block';
        return;
    }
    
    panelResult.style.opacity = '1';
    panelResult.style.borderColor = 'var(--orange-accent)';
    containerResult.style.display = 'flex';
    placeholderText.style.display = 'none';
    
    // 1. DADOS DA ARMADURA
    const [armorType, armorName] = armorVal.split('|');
    let armorRow = db[armorType].find(a => a.NomeItem === armorName);
    
    const armorClass = parseInt(armorRow.ClasseBlindagem, 10);
    const armorDurability = parseFloat(armorRow.Durabilidade);
    const armorMaterial = armorRow.Material || "";
    
    // Inteligência Artificial: Área Protegida Forçada para Máscaras
    let armorAreas = armorRow.AreaProtegida || "-"; 
    if (armorType === "masks") {
        armorAreas = "Face"; 
    }
    
    // Lógica Avançada de Pontos de Vida (HP) com base na região (Totalmente dinâmica do Dicionário)
    let maxHp = 85; 
    let regionText = t.simDynamicTexts.chest;
    
    if (armorType === "helmets") {
        maxHp = 40;
        regionText = t.simDynamicTexts.head;
    } else if (armorType === "masks") {
        maxHp = 40;
        regionText = t.simDynamicTexts.face;
    }
    
    const slider = document.getElementById('sim-range-dur');
    let currentDurability = armorDurability; 
    if (slider && document.getElementById('sim-durability-control').style.display !== 'none') {
        currentDurability = parseFloat(slider.value);
    }
    
    // 2. DADOS DA MUNIÇÃO E TRAUMA
    let dmgInfo = db.damageData.find(d => d.Arma === wName);
    let cal = dmgInfo ? dmgInfo.Calibre : null;
    
    let ammoRow = db.ammo.find(a => a.NomeItem === aName && a.Calibre === cal);
    
    let pCount = 1;
    if (ammoRow && ammoRow.DanoBase) {
        const dMatch = ammoRow.DanoBase.match(/^(\d+)x(\d+)/i);
        if (dMatch) pCount = parseInt(dMatch[2], 10);
    }
    
    const penStat = parseInt(ammoRow.Penetracao || 0, 10);
    const pierceLevel = Math.floor(penStat / 10);
    
    // Extração do Dano Base da Munição Pura (Usada na Nova Física de Esmagamento)
    let ammoBaseDmg = 0;
    if (ammoRow && ammoRow.DanoBase) {
        let match = ammoRow.DanoBase.match(/^(\d+)/);
        if (match) ammoBaseDmg = parseFloat(match[1]);
    }
    
    let bluntDamage = 0;
    let armorDamageStat = 0;
    if (ammoRow) {
        bluntDamage = parseFloat(ammoRow["Ferimento Contuso"] || ammoRow["ferimento contuso"] || ammoRow.FerimentoContuso || ammoRow.BluntDamage || 0) * pCount;
        armorDamageStat = parseFloat(ammoRow["Dano de Blindagem"] || ammoRow["dano de blindagem"] || ammoRow.DanoBlindagem || ammoRow.ArmorDamage || 0) * pCount;
        
        armorDamageStat = Math.round(armorDamageStat * 100) / 100;
    }
    
    // 3. DADOS DA ARMA E ALCANCE
    let dmgRow = db.damageData.find(d => d.Arma === wName && d["nome da munição"] === aName);
    let baseDamage = 0;
    let finalBaseDamage = 0;
    let singleBaseDamage = 0; 
    let singleFinalDamage = 0; 
    let distInicial = 0;
    let distFinal = 0;
    
    if (dmgRow) {
        const pairs = dmgRow["dano(alcance)"].split('|').map(s => s.trim());
        
        // Extrai o Dano e Distância Iniciais (Mantido Intacto)
        const match = pairs[0].match(/^(\d+)\((\d+)\)$/);
        if (match) {
            singleBaseDamage = parseInt(match[1], 10);
            baseDamage = singleBaseDamage * pCount;
            distInicial = parseInt(match[2], 10);
        }
        
        // Se existir a barra '|' com o segundo valor, mantém o seu código original intacto
        if (pairs.length > 1) {
            const matchF = pairs[pairs.length - 1].match(/^(\d+)\((\d+)\)$/);
            if (matchF) {
                singleFinalDamage = parseInt(matchF[1], 10);
                finalBaseDamage = singleFinalDamage * pCount;
                distFinal = parseInt(matchF[2], 10);
            }
        } else {
            // =======================================================
            // GERADOR DE CHÃO DA BALÍSTICA (Injeção de Dano Final)
            // =======================================================
            // Se existir apenas um valor (Ex: Snipers), gera o alcance final (+3m)
            distFinal = distInicial + 3;
            
            // Calcula a Queda de Dano (70% do Dano Inicial)
            let rawFinalDamage = singleBaseDamage * 0.70;
            
            // Regra Estrita de Arredondamento da Engine (.5 a .9 sobe)
            let fraction = rawFinalDamage - Math.floor(rawFinalDamage);
            if (fraction >= 0.5) {
                singleFinalDamage = Math.ceil(rawFinalDamage);
            } else {
                singleFinalDamage = Math.floor(rawFinalDamage);
            }
            
            finalBaseDamage = singleFinalDamage * pCount;
        }
    }

    // Aplicação Orgânica da "Física do Soco" (Comprimento do Cano) no Dano Contuso
    let scaleRatio = ammoBaseDmg > 0 ? baseDamage / ammoBaseDmg : 1.0;
    bluntDamage = bluntDamage * scaleRatio;

    // =======================================================
    // NOVA TRAVA: MITIGAÇÃO DE TRAUMA PARA CHUMBO GROSSO (Múltiplos Projéteis)
    // =======================================================
    // Oito projéteis fracos não somam trauma contra placas grossas; eles se espatifam.
    let diffAbsoluto = pierceLevel - armorClass;
    if (pCount > 1 && diffAbsoluto < 0) {
        // Se o colete for mais forte que o chumbinho, o trauma despenca exponencialmente
        let mitigacaoChumbo = Math.pow(0.40, Math.abs(diffAbsoluto)); 
        bluntDamage = bluntDamage * mitigacaoChumbo;
    }

    bluntDamage = Math.round(bluntDamage * 100) / 100;

    // =======================================================
    // PREENCHIMENTO DO CABEÇALHO
    // =======================================================
    document.getElementById('sim-rep-weapon').textContent = wName;
    document.getElementById('sim-rep-ammo').textContent = aName;
    document.getElementById('sim-rep-armor').textContent = armorName;
    
    document.getElementById('sim-rep-pierce').textContent = pierceLevel;
    document.getElementById('sim-rep-penstat').textContent = penStat;
    if (document.getElementById('sim-rep-armordmg')) document.getElementById('sim-rep-armordmg').textContent = armorDamageStat;
    
    let strBase = pCount > 1 ? `${singleBaseDamage}x${pCount} (${baseDamage})` : `${baseDamage}`;
    let strFinal = pCount > 1 ? `${singleFinalDamage}x${pCount} (${finalBaseDamage})` : `${finalBaseDamage}`;
    
    document.getElementById('sim-rep-basedmg').textContent = (baseDamage === finalBaseDamage) 
        ? strBase 
        : `${strBase} ${t.simDynamicTexts.initial} ➔ ${strFinal} ${t.simDynamicTexts.final}`;
    
    document.getElementById('sim-rep-armorclass').textContent = armorClass;
    document.getElementById('sim-rep-armordur').textContent = armorDurability;
    
    // INJEÇÃO BILINGUE DO MATERIAL DA ARMADURA
    let displayMaterial = armorMaterial;
    if (currentLang !== 'en') {
        displayMaterial = traduzirDado(armorType, 'Material', armorMaterial);
    }
    document.getElementById('sim-rep-armormaterial').textContent = displayMaterial;

    // Tradução e Alimentação das Áreas Protegidas direto do Dicionário
    let displayAreas = armorAreas;
    if (t.simArmorAreasMap) {
        Object.keys(t.simArmorAreasMap).forEach(enKey => {
            displayAreas = displayAreas.split(enKey).join(t.simArmorAreasMap[enKey]);
        });
    }
    document.getElementById('sim-rep-armorareas').textContent = displayAreas;
    
    const durBox = document.getElementById('sim-rep-current-dur-box');
    if (durBox) {
        if (currentDurability < armorDurability) {
            durBox.style.visibility = 'visible';
            document.getElementById('sim-rep-current-dur').textContent = currentDurability;
        } else {
            durBox.style.visibility = 'hidden';
        }
    }
    
    // =======================================================
    // MOTOR MATEMÁTICO UNIVERSAL (A NOVA ESCALA DE PERFURAÇÃO)
    // =======================================================
    let penChance = 0;
    let damageOnPen = 0;
    let damageOnPenFinal = 0;
    let statusId = "full"; 
    
    let diff = pierceLevel - armorClass;
    let remainder = penStat % 10;
    let dynamicMultiplier = 0.0;
    
    // -------------------------------------------------------
    // PARTE 1: CHANCE DE PENETRAÇÃO (A Roleta Russa)
    // -------------------------------------------------------
    if (diff >= 2) {
        penChance = 100;
        statusId = "over";
    } 
    else if (diff === 1) {
        penChance = 100;
        statusId = "high";
    }
    else if (diff === 0) {
        if (remainder >= 5) {
            penChance = 100;
        } else {
            penChance = 80 + (remainder * 5); 
            if (penChance > 99) penChance = 99; 
        }
        statusId = "partial";
    }
    else {
        // CURVA EXPONENCIAL REAL (Para balas fracas contra coletes fortes)
        let x = ((armorClass * 10 + 5) - penStat) / 10.0;
        penChance = (1 / Math.pow(2, x)) * 100;
        if (penChance > 50) penChance = 50; 
        
        if (diff === -1) {
            statusId = "low";
        } else {
            statusId = "veryLow";
        }

        // =======================================================
        // O COFRE DAS EXCEÇÕES DE DESENVOLVEDOR (NERFS OCULTOS)
        // =======================================================
        // 1. O Nerf Anti-One-Shot das Escopetas (Exclusivo para Balotes/Slugs)
        if (cal === "12x70mm" && pCount === 1 && diff <= -3) {
            penChance = 0.0;
        }
        
        // 2. O Nerf Oculto da ML Lever-Action (Civilian Weapon Restriction)
        if (wName === "ML Lever-Action") {
            penChance = penChance * 0.25;
        }
    }

    // -------------------------------------------------------
    // PARTE 2: RETENÇÃO DE DANO PERFURANTE (Fórmula Decodificada AAA)
    // -------------------------------------------------------
    if (diff >= 2) {
        // Degrau 1: Over-Penetration Absoluta (Passa 100%)
        dynamicMultiplier = 1.0;
    } 
    else if (diff === 1) {
        // Degrau 2: Domínio Leve (Passa 90% a 99%)
        dynamicMultiplier = 0.90 + (remainder * 0.01);
    }
    else if (diff === 0) {
        // Degrau 3: O Empate (Passa 65% a 69.5%)
        dynamicMultiplier = 0.65 + (remainder * 0.005);
    }
    else if (diff === -1) {
        // Degrau 4: Desvantagem Leve (Passa 60% a 64.5%)
        dynamicMultiplier = 0.60 + (remainder * 0.005);
    }
    else {
        // Degrau 5: O Fundo do Poço (Trava Mínima de 60%)
        dynamicMultiplier = 0.60;
    }
    
    // NERF DE DANO PÓS-PENETRAÇÃO MANTIDO (EXCEÇÃO DA DEAGLE)
    // A Deagle perde a quebra artificial, mas mantém o Nerf de penetração intacto.
    if ((wName === "Deagle" || wName === "G-Deagle") && diff <= -2) {
        dynamicMultiplier = 0.28; 
    }
    
    // Retenção do Dano que Penetra o Colete
    damageOnPen = Math.round(baseDamage * dynamicMultiplier);
    damageOnPenFinal = Math.round(finalBaseDamage * dynamicMultiplier);
    
    // =======================================================
    // A MÁGICA DA DISSIPAÇÃO DE ENERGIA (DESGASTE ORGÂNICO)
    // =======================================================
    const armorModifiers = { 
        "Aramid": 0.30, "Aramida": 0.30, 
        "Polyethylene": 0.35, "Polietileno": 0.35, 
        "Titanium": 0.40, "Titânio": 0.40, 
        "Aluminum": 0.45, "Alumínio": 0.45, 
        "Composite": 0.55, "Composto": 0.55, 
        "Hardened Steel": 0.60, "Aço Endurecido": 0.60, 
        "Ceramic": 0.65, "Cerâmica": 0.65,
        "Glass": 0.70, "Vidro": 0.70 
    };
    
    let modifier = armorModifiers[armorMaterial] || 0.50; 
    let penMitigation = 1.0;
    let lossPerShot = 0;

    if (diff >= -2) {
        // PERFURAÇÃO ALTA (Nível 4, 5, 6): Mitigação clássica de estilhaço de placa
        if (diff === -1) penMitigation = 0.70;        
        else if (diff === -2) penMitigation = 0.40;   
        else penMitigation = 1.0; 
        lossPerShot = armorDamageStat * modifier * penMitigation;
        
    } else if (diff === -3) {
        // O PURGATÓRIO (Nível 3): A bala raspa, não esmaga logo de cara, mas desgasta a placa devagar.
        penMitigation = 0.20; 
        lossPerShot = armorDamageStat * modifier * penMitigation;
        
    } else {
        // ABISMO EXTREMO (Nível 0, 1, 2, diff <= -4): Morte por esmagamento puro.
        let pressure = armorDamageStat / (armorClass * 10);
        let energyDump = Math.pow(pressure, 0.5) * 0.95; 
        if (energyDump < 0.10) energyDump = 0.10;
        if (energyDump > 1.0) energyDump = 1.0;
        lossPerShot = armorDamageStat * modifier * energyDump;
    }

    // Buff de Quebra da ML Lever-Action mantido para compensar a perda oculta de penetração
    if (wName === "ML Lever-Action") {
        lossPerShot = lossPerShot * 1.20; 
    }
    
    let shotsToBreak = "-";
    let isAlreadyBroken = false;
    let threshold = armorDurability / 2.0; 
    
    if (lossPerShot > 0) {
        let durabilityToLose = currentDurability - threshold;
        if (durabilityToLose <= 0) {
            shotsToBreak = "0"; 
            isAlreadyBroken = true;
        } else {
            // Arredondamos a vida perdida da armadura com Math.ceil para refletir o último impacto necessário
            shotsToBreak = Math.ceil(durabilityToLose / lossPerShot).toString();
        }
    }

    // =======================================================
    // ESCALONAMENTO DE DESGASTE NA CHANCE DE PENETRAÇÃO
    // =======================================================
    let durPct = (currentDurability / armorDurability) * 100;
    
    if (durPct <= 50) {
        penChance = 100;
    } else if (durPct < 100) {
        let basePenChance = penChance;
        let increase = ((100 - durPct) / 50.0) * (100 - basePenChance);
        penChance = basePenChance + increase;
    }

    penChance = Math.round(penChance * 100) / 100; 

    // =======================================================
    // MOTOR DE TTK: QUEDA DE DANO CONTUSO (LONGO ALCANCE)
    // =======================================================
    let singleBlunt = bluntDamage / pCount;
    let singleBluntFar = singleBlunt;

    // A MÁGICA DA PROPORÇÃO (Isolada apenas para o Nível 0)
    if (pierceLevel === 0 && baseDamage > 0 && finalBaseDamage > 0) {
        // Aplicando a sua visão: se a bala não perfura (Dum-Dum/LRN), o impacto contuso 
        // deve cair na mesma proporção exata em que ela perde Dano Base com a distância.
        let distanceDropRatio = finalBaseDamage / baseDamage;
        singleBluntFar = singleBlunt * distanceDropRatio;
    } else {
        // Regra original mantida INTACTA para proteger as armas de Nível 1, 2, 3, etc.
        if (singleBlunt >= 6.0) {
            singleBluntFar -= 2.0;
        } else if (singleBlunt >= 2.0) {
            singleBluntFar -= 1.0;
        }
    }

    let bluntDamageFar = Math.round((singleBluntFar * pCount) * 100) / 100;

    // =======================================================
    // O MOTOR QUÂNTICO (EXTREMOS E MÉDIA ESTATÍSTICA)
    // =======================================================
    
    // 1. O Pior Cenário Absoluto (Azar Total)
    function calculateMaxTTK(dmgBase, basePenChancePct, dmgPen, dmgBlunt, dmgArmorPerShot) {
        let hp = maxHp; 
        let dur = currentDurability; 
        let shots = 0;
        
        for (let i = 0; i < 99; i++) {
            shots++;
            
            // FÍSICA REAL: Simula a curva de degradação até no pior cenário
            let currentPenChance = basePenChancePct;
            let durPct = (dur / armorDurability) * 100;
            
            if (durPct <= 50) {
                currentPenChance = 100;
            } else if (durPct < 100) {
                let ratio = (100 - durPct) / 50.0;
                let increase = Math.pow(ratio, 2) * (100 - basePenChancePct);
                currentPenChance = basePenChancePct + increase;
            }
            
            // AZAR TOTAL: O jogo te odeia. A bala SÓ fura se a chance chegar a 100%.
            let penetrates = (currentPenChance >= 100);
            
            let nextDurBlock = Math.max(0, dur - dmgArmorPerShot);
            let nextDurPen = Math.max(0, dur - (dmgArmorPerShot * 0.30));
            
            if (dur <= 0) {
                hp -= dmgBase; // Colete zerado = O Azar Total toma o Dano Base Inteiro
            } else if (penetrates) {
                hp -= dmgPen;
                dur = nextDurPen;
            } else {
                hp -= dmgBlunt;
                dur = nextDurBlock;
            }
            
            if (hp <= 0) return shots;
        }
        return "100+";
    }

    // 2. O Melhor Cenário Absoluto (Sorte Total)
    function calculateMinTTK(dmgBase, dmgPen, dmgArmorPerShot) {
        if (dmgPen <= 0) return "-";
        
        let hp = maxHp; 
        let dur = currentDurability; 
        let shots = 0;
        
        for (let i = 0; i < 99; i++) {
            shots++;
            
            let nextDurPen = Math.max(0, dur - (dmgArmorPerShot * 0.30));
            
            if (dur <= 0) {
                hp -= dmgBase; // Colete zerado = Toma o Dano Base
            } else {
                hp -= dmgPen;  // SORTE TOTAL: Todas as balas furam direto
                dur = nextDurPen;
            }
            
            if (hp <= 0) return shots;
        }
        return "100+";
    }

    // 3. O Novo Motor Quântico: Média Realista com Física de Degradação
    function calculateTrueAverageTTK(dmgBase, basePenChancePct, dmgPen, dmgBlunt, dmgArmorPerShot) {
        if (basePenChancePct >= 100) return Math.ceil(maxHp / dmgPen);
        if (dmgPen <= 0 && dmgBlunt <= 0) return "-";
        
        let memo = {}; 
        
        function getExpectedShots(hp, dur, depth) {
            if (hp <= 0) return 0;
            if (depth > 60) return 60; // Trava de segurança
            
            let stateKey = `${hp.toFixed(1)}_${dur.toFixed(1)}`;
            if (memo[stateKey]) return memo[stateKey];
            
            let currentPenChance = basePenChancePct;
            let durPct = (dur / armorDurability) * 100;
            
            if (durPct <= 50) {
                currentPenChance = 100;
            } else if (durPct < 100) {
                let ratio = (100 - durPct) / 50.0;
                let increase = Math.pow(ratio, 2) * (100 - basePenChancePct);
                currentPenChance = basePenChancePct + increase;
            }
            
            let p = currentPenChance / 100.0;
            if (p > 1) p = 1.0;
            if (p < 0) p = 0.0;
            
            let expected = 1; 
            
            let nextDur = dur - dmgArmorPerShot;
            if (nextDur < 0) nextDur = 0;
            
            let appliedPenDamage = (dur <= 0) ? dmgBase : dmgPen;
            
            if (p === 1.0) {
                expected += getExpectedShots(hp - appliedPenDamage, nextDur, depth + 1);
            } else if (p === 0.0) {
                expected += getExpectedShots(hp - dmgBlunt, nextDur, depth + 1);
            } else {
                expected += p * getExpectedShots(hp - appliedPenDamage, nextDur, depth + 1) + 
                            (1 - p) * getExpectedShots(hp - dmgBlunt, nextDur, depth + 1);
            }
            
            memo[stateKey] = expected;
            return expected;
        }
        
        let ev = getExpectedShots(maxHp, currentDurability, 0);
        if (ev > 59) return "60+";
        
        return ev % 1 === 0 ? ev.toString() : ev.toFixed(1);
    }
    
    // =======================================================
    // ATUALIZAÇÃO VISUAL (DURABILIDADE 0 = DANO BASE INTEGRAL)
    // =======================================================
    if (currentDurability <= 0) {
        damageOnPen = baseDamage;
        damageOnPenFinal = finalBaseDamage;
    }
    // =======================================================
    // PROCESSAMENTO DOS RESULTADOS (MÉDIA REALISTA + CONTUNDENTE)
    // =======================================================
    
    // Resgata a velocidade da bala para os Estágios Cinéticos
    let currentVel = 400; 
    if (ammoRow && ammoRow.Velocidade) currentVel = parseFloat(ammoRow.Velocidade);

    let shotsToKill = "-";
    let shotsToKillFinal = "-";
    let averageShotsToKill = "-";
    let averageShotsToKillFinal = "-";
    
    if (damageOnPen > 0 || bluntDamage > 0) {
        let maxTTK = calculateMaxTTK(baseDamage, penChance, damageOnPen, bluntDamage, lossPerShot);
        let minTTK = calculateMinTTK(baseDamage, damageOnPen, lossPerShot);
        
        shotsToKill = (minTTK === maxTTK || maxTTK === "100+") ? maxTTK : `${minTTK} ~ ${maxTTK}`;
        
        let pureEV = calculateTrueAverageTTK(baseDamage, penChance, damageOnPen, bluntDamage, lossPerShot);
        
        // ---------------------------------------------------------
        // ÂNCORA ESTATÍSTICA DE DANO CONTUNDENTE E FADIGA CINÉTICA
        // ---------------------------------------------------------
        // A trava foi recuada para -4, blindando a fadiga dinâmica extrema apenas para munições muito fracas.
        if (diff <= -4 && maxTTK !== "100+") {
             let maxNum = parseFloat(maxTTK);
             let tbNum = parseFloat(shotsToBreak);
             
             if (!isNaN(maxNum) && !isNaN(tbNum) && tbNum > 0) {
                 let ratio = maxNum / tbNum;
                 let mediaRealista = Math.round(maxNum); 
                 
                 if (ratio >= 0.45) {
                     let baseMult = 0.0;
                     if (currentVel >= 700) baseMult = 0.35; 
                     else if (currentVel >= 400) baseMult = 0.25; 
                     else baseMult = 0.10; 
                     
                     let dynamicFatigue = ratio * baseMult;
                     let reducaoTiros = (Math.pow(maxNum, 2) / tbNum) * dynamicFatigue;
                     mediaRealista = Math.round(maxNum - reducaoTiros);
                 }
                 averageShotsToKill = mediaRealista.toString();
             } else {
                 averageShotsToKill = Math.round(parseFloat(pureEV)).toString();
             }
        } else {
             // Se for diff >= -3 (incluindo as de Nível 3), usa a curva clássica de perfuração limpa
             if (pureEV === "-" || pureEV === "60+") {
                 averageShotsToKill = pureEV;
             } else {
                 averageShotsToKill = Math.round(parseFloat(pureEV)).toString();
             }
        }
    }

    if (damageOnPenFinal > 0 || bluntDamageFar > 0) {
        let maxTTKFar = calculateMaxTTK(finalBaseDamage, penChance, damageOnPenFinal, bluntDamageFar, lossPerShot);
        let minTTKFar = calculateMinTTK(finalBaseDamage, damageOnPenFinal, lossPerShot);
        
        shotsToKillFinal = (minTTKFar === maxTTKFar || maxTTKFar === "100+") ? maxTTKFar : `${minTTKFar} ~ ${maxTTKFar}`;
        
        let pureEVFar = calculateTrueAverageTTK(finalBaseDamage, penChance, damageOnPenFinal, bluntDamageFar, lossPerShot);
        
        // A trava foi recuada para -4 (Longo Alcance)
        if (diff <= -4 && maxTTKFar !== "100+") {
             let maxNumFar = parseFloat(maxTTKFar);
             let tbNumFar = parseFloat(shotsToBreak);
             
             if (!isNaN(maxNumFar) && !isNaN(tbNumFar) && tbNumFar > 0) {
                 let ratioFar = maxNumFar / tbNumFar;
                 let mediaRealistaFar = Math.round(maxNumFar);
                 
                 if (ratioFar >= 0.45) {
                     let baseMultFar = 0.0;
                     if (currentVel >= 700) baseMultFar = 0.35;
                     else if (currentVel >= 400) baseMultFar = 0.25;
                     else baseMultFar = 0.10;
                     
                     let dynamicFatigueFar = ratioFar * baseMultFar;
                     let reducaoTirosFar = (Math.pow(maxNumFar, 2) / tbNumFar) * dynamicFatigueFar;
                     mediaRealistaFar = Math.round(maxNumFar - reducaoTirosFar);
                 }
                 averageShotsToKillFinal = mediaRealistaFar.toString();
             } else {
                 averageShotsToKillFinal = Math.round(parseFloat(pureEVFar)).toString();
             }
        } else {
             // Se for diff >= -3, usa a probabilidade pura
             if (pureEVFar === "-" || pureEVFar === "60+") {
                 averageShotsToKillFinal = pureEVFar;
             } else {
                 averageShotsToKillFinal = Math.round(parseFloat(pureEVFar)).toString();
             }
        }
    }
    
    // =======================================================
    // ALIMENTANDO OS DADOS NA TELA (ATUALIZADO PARA ESCALA 64% - FONTES IGUAIS)
    // =======================================================
    const lblRegionClose = document.getElementById('sim-lbl-ttk-region-close');
    const lblRegionFar = document.getElementById('sim-lbl-ttk-region-far');
    if (lblRegionClose) lblRegionClose.textContent = regionText;
    if (lblRegionFar) lblRegionFar.textContent = regionText;

    const lblAvgRegionClose = document.getElementById('sim-lbl-avgttk-region-close');
    const lblAvgRegionFar = document.getElementById('sim-lbl-avgttk-region-far');
    if (lblAvgRegionClose) lblAvgRegionClose.textContent = regionText;
    if (lblAvgRegionFar) lblAvgRegionFar.textContent = regionText;

    document.getElementById('sim-rep-bluntdmg').textContent = bluntDamage > 0 ? bluntDamage : "-";
    document.getElementById('sim-rep-dist-close').textContent = t.simDynamicTexts.rangeClose.replace('{0}', distInicial);

    const valDmgClose = document.getElementById('sim-res-val-dmg');
    if (pCount > 1) {
        valDmgClose.textContent = `${Math.round(damageOnPen / pCount)}x${pCount} (${damageOnPen})`;
        valDmgClose.style.fontSize = "1.53rem"; // <-- MÁGICA: Fonte grande igualada
        valDmgClose.style.whiteSpace = "nowrap"; // Impede que o texto quebre em duas linhas
    } else {
        valDmgClose.textContent = damageOnPen;
        valDmgClose.style.fontSize = "1.53rem"; 
    }

    document.getElementById('sim-res-val-avg').textContent = shotsToBreak;
    document.getElementById('sim-res-val-ttk').textContent = shotsToKill;
    document.getElementById('sim-res-val-avgttk').textContent = averageShotsToKill;

    const panelFar = document.getElementById('sim-panel-far');
    if (baseDamage !== finalBaseDamage && finalBaseDamage > 0) {
        panelFar.style.display = 'flex'; 
        
        document.getElementById('sim-rep-dist-far').textContent = t.simDynamicTexts.rangeFar.replace('{0}', distFinal);
        
        const valDmgFar = document.getElementById('sim-res-val-dmg-far');
        if (pCount > 1) {
            valDmgFar.textContent = `${Math.round(damageOnPenFinal / pCount)}x${pCount} (${damageOnPenFinal})`;
            valDmgFar.style.fontSize = "1.53rem"; // <-- MÁGICA: Fonte grande igualada
            valDmgFar.style.whiteSpace = "nowrap"; // Impede que o texto quebre em duas linhas
        } else {
            valDmgFar.textContent = damageOnPenFinal;
            valDmgFar.style.fontSize = "1.53rem"; 
        }
        
        document.getElementById('sim-res-val-avg-far').textContent = shotsToBreak;
        document.getElementById('sim-res-val-ttk-far').textContent = shotsToKillFinal;
        document.getElementById('sim-res-val-avgttk-far').textContent = averageShotsToKillFinal;
    } else {
        panelFar.style.display = 'none'; 
    }

    // =======================================================
    // CORES E EFEITOS DO STATUS
    // =======================================================
    document.getElementById('sim-res-val-pen').textContent = penChance + "%";

    const statusBox = document.getElementById('sim-status-box');
    const statusLabel = document.getElementById('sim-status-label');
    
    let colorHex = "#4CAF50"; 
    
    if (statusId === "over" || isAlreadyBroken) {
        colorHex = "#4CAF50"; 
    } else if (statusId === "high") {
        colorHex = "#8BC34A"; 
    } else if (statusId === "partial") {
        colorHex = "#FFC107"; 
    } else {
        colorHex = "#F44336"; 
    }
    
    document.getElementById('sim-res-val-pen').style.color = colorHex;
    statusLabel.style.color = colorHex;
    statusBox.style.borderColor = colorHex;
    
    if (colorHex === "#4CAF50") statusBox.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
    if (colorHex === "#8BC34A") statusBox.style.backgroundColor = "rgba(139, 195, 74, 0.1)";
    if (colorHex === "#FFC107") statusBox.style.backgroundColor = "rgba(255, 193, 7, 0.1)";
    if (colorHex === "#F44336") statusBox.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
    
    document.getElementById('sim-res-val-dmg').style.color = colorHex;
    document.getElementById('sim-res-val-avg').style.color = colorHex;
    document.getElementById('sim-res-val-ttk').style.color = colorHex;
    document.getElementById('sim-res-val-avgttk').style.color = colorHex;
    
    document.getElementById('sim-res-val-dmg-far').style.color = colorHex;
    document.getElementById('sim-res-val-avg-far').style.color = colorHex;
    document.getElementById('sim-res-val-ttk-far').style.color = colorHex;
    if(document.getElementById('sim-res-val-avgttk-far')) document.getElementById('sim-res-val-avgttk-far').style.color = colorHex;

    // =======================================================
    // EXIBIÇÃO DO AVISO DE MÚLTIPLOS PROJÉTEIS (PELLETS)
    // =======================================================
    const warningBox = document.getElementById('sim-warning-pellets');
    if (warningBox) {
        if (pCount > 1) {
            warningBox.style.display = 'block';
        } else {
            warningBox.style.display = 'none';
        }
    }
}

// =====================================================================
// MOTOR DE CALIBRAÇÃO INTELIGENTE DO LAYOUT DO SIMULADOR (AUTO-RESIZE)
// =====================================================================
function calibrateSimulatorLayout() {
    let maxWepLen = 0;
    if (db.weapons) db.weapons.forEach(w => { 
        if (w.NomeItem && w.NomeItem.length > maxWepLen) maxWepLen = w.NomeItem.length; 
    });
    
    let maxAmmoLen = 0;
    if (db.ammo) db.ammo.forEach(a => { 
        let fullName = `[Lv.9] ${a.NomeItem || ""}`; 
        if (fullName.length > maxAmmoLen) maxAmmoLen = fullName.length; 
    });
    
    let maxArmorLen = 0;
    const allArmors = [].concat(db.helmets || [], db.masks || [], db.bodyArmor || [], db.armoredRigs || []);
    allArmors.forEach(a => { 
        let fullName = `[Lv.6] ${a.NomeItem || ""}`;
        if (fullName.length > maxArmorLen) maxArmorLen = fullName.length; 
    });
    
    // --- A MÁGICA DA CALIBRAÇÃO UNIVERSAL ---
    // Pega todos os dicionários existentes dinamicamente e acha a maior palavra entre todos eles!
    const getL = (key) => {
        let maxLength = 0;
        for (let langCode in translations) {
            let textLen = (translations[langCode][key] || "").length;
            if (textLen > maxLength) maxLength = textLen;
        }
        return maxLength;
    };
    
    const wHeadWep = Math.max(maxWepLen, getL('lblSimRepWeaponTitle'));
    const wHeadAmmo = Math.max(maxAmmoLen, getL('lblSimRepAmmoTitle'));
    const wHeadArmor = Math.max(maxArmorLen, getL('lblSimRepArmorTitle'));
    
    const projLabels = [
        getL('lblSimPierceLevel'), getL('lblSimExactPen'), 
        getL('lblSimArmorDmg'),
        getL('lblSimBaseDmg'), getL('lblSimBluntDmg')
    ];
    const maxProjLabel = Math.max(...projLabels);
    
    const armorLabels = [
        getL('lblSimArmorClassLabel'), getL('lblSimArmorMaterialLabel'), 
        getL('lblSimArmorMaxDur'), getL('lblSimArmorCurDur'), getL('lblSimArmorAreas')
    ];
    const maxArmorStatusLabel = Math.max(...armorLabels);
    
    let maxAreaLen = 0;
    allArmors.forEach(a => { 
        if (a.AreaProtegida && a.AreaProtegida.length > maxAreaLen) {
            maxAreaLen = a.AreaProtegida.length;
        }
    });
    if (maxAreaLen < 48) maxAreaLen = 48;

    const maxProjValue = 46;
    
    const boxProjWidth = maxProjLabel + maxProjValue + 6;
    const boxArmorWidth = maxArmorStatusLabel + maxAreaLen + 6;
    
    const root = document.documentElement;
    
    // Aumentado para +5ch de folga para garantir que nenhuma palavra aperte o layout verticalmente
    root.style.setProperty('--sim-hdr-wep', `${wHeadWep + 5}ch`);
    root.style.setProperty('--sim-hdr-ammo', `${wHeadAmmo + 5}ch`);
    root.style.setProperty('--sim-hdr-armor', `${wHeadArmor + 5}ch`);
    
    root.style.setProperty('--sim-box-proj', `${boxProjWidth + 5}ch`);
    root.style.setProperty('--sim-box-armor', `${boxArmorWidth + 5}ch`);
}
