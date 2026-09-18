// =====================================================================
// 1. DICIONÁRIO DA INTERFACE DO APLICATIVO (i18n)
// =====================================================================
const translations = {
    pt: {
        appTitle: "ABIDB Web",
        navSearch: "Busca de Itens",
        navCompare: "Comparação",
        toggleLangBtn: "Switch to English",
        navDamage: "Limites de Dano por Alcance",
        navMaskComp: "Compatibilidade<br><span style='font-size: 0.85em; color: var(--text-dim); font-weight: normal;'>Máscaras x Capacetes</span>",
        // --- NOVO: Textos do Menu e Telas de Artigos/Changelog ---
        navArticles: "Artigos e Guias",
        navChangelog: "Changelog",
        navChangelogReading: "Lendo data...",
        navAbout: "Sobre a Ferramenta",
        titleAbout: "Sobre a Ferramenta",
        lblAboutLoading: "Carregando informações do desenvolvedor...",
        lblAboutError: "Erro ao ler as informações do desenvolvedor.",

        aboutFileName: "sobre.md",

        titleArticles: "Artigos e Guias",
        lblArticlesMenu: "Tópicos Disponíveis",
        lblArticlesPlaceholder: "Selecione um tópico no menu lateral para iniciar a leitura.",
        lblArticlesError: "Erro ao carregar o artigo.",
        
        titleChangelog: "Histórico de Atualizações",
        lblChangelogLoading: "Carregando histórico de atualizações...",
        lblChangelogError: "Erro ao carregar o changelog.",

        // Textos da aba: Busca de Itens com Filtro
        titleSearch: "Busca de Itens com Filtro",
        descSearch: "Selecione a categoria e os filtros para buscar equipamentos.",
        lblCategory: "Categoria:",
        lblCriteria: "Critério:",
        lblOrder: "Ordem:",
        orderAsc: "Crescente",
        orderDesc: "Decrescente",
        btnFilter: "Filtros",
        btnSave: "Salvar resultados",
        btnSearchBack: "Voltar",
        btnFilterReset: "Resetar Filtros",
        btnFilterConfirm: "Confirmar Filtros",
        btnFilterCancel: "Cancelar",
        lblCount: "Exibindo: 0 itens",
        gridPlaceholder1: "Selecione uma categoria para carregar os dados...",

        // Textos dos Dropdowns de Subcategorias
        lblMedicalCat: "Categoria Farmacêutica:",
        optMedPainkillers: "Analgésicos",
        optMedBandages: "Bandagens",
        optMedSurgical: "Kits Cirúrgicos",
        optMedNebulizers: "Nebulizadores",
        optMedMedkits: "Kits Médicos",
        optMedStimulants: "Estimulantes",

        lblFoodCat: "Categoria Gastronômica:",
        optFoodAll: "Todas as comidas e bebidas",
        optFoodItems: "Comidas",
        optFoodBeverages: "Bebidas",
        
        // Textos da aba: Comparação e Compatibilidade
        titleCompare: "Comparação e Compatibilidade",
        descCompare: "Escolha um dos módulos de comparação abaixo:",
        btnCompWeapons: "Comparar armas",
        btnCompMasks: "Consultar compatibilidade de máscaras e capacetes",
        btnCompBallistics: "Comparar Eficiência Balística",
        gridPlaceholder2: "Nenhum módulo selecionado.",

        // --- MENSAGENS DO SISTEMA E TOOLTIPS DINÂMICOS ---
        msgDownloading: "Baixando banco de dados...",
        msgDbReady: "Banco de dados pronto! Selecione uma categoria.",
        // Menus e Filtros de Interface
        lblMenuTools: "FERRAMENTAS DE DADOS",
        lblMenuKnowledge: "CONHECIMENTO",
        navCompareWeapons: "Comparação de Armas",
        lblAmmoCat: "Categoria:",
        lblAmmoWep: "Arma:",
        btnAmmoReset: "Resetar Seleções e Filtros",
        tooltipFilter: "Ocultar itens: Clique aqui para abrir o painel e filtrar características específicas que você não quer ver na tabela.",
        
        // Tela de Comparação
        titleCompareWeapons: "Comparação de Armas",
        lblCompSelectedTitle: "Armas Selecionadas",
        lblCompEmpty: "Nenhuma arma selecionada. Escolha as armas abaixo.",
        btnCompCompare: "Comparar Armas Selecionadas",
        btnCompClearAll: "Limpar Todas as Seleções",
        lblCompFilterTitle: "Filtros de Exclusão (Marque as características que deseja remover do catálogo)",
        btnCompResetFilters: "Limpar Filtros",
        lblCompResultsTitle: "Resultados da Comparação",
        btnCompBack: "Voltar à Seleção",
        
        // Tela de Máscaras
        titleMaskComp: "Compatibilidade: Máscaras x Capacetes",
        btnMaskFilter: "Filtros de Classe",
        btnMaskResetQuick: "Remover Filtros",
        
        // Artigos e Botões Gerais
        btnArticlesBack: "Voltar à Lista",
        lblUpdated: "Atualizado:",
        
        // Exportação e Alertas
        msgZeroItemsLoad: "Exibindo: 0 itens (Dados não carregados)",
        msgShowingItemsPrefix: "Exibindo: ",
        msgShowingItemsSuffix: " itens",
        tooltipClickSort: "Clique para ordenar",
        tooltipFaceProtection: "Proteção facial já embutida neste capacete.",
        msgExporting: "⏳ Exportando...",
        msgExportResults: "📷 Exportar Resultados",
        msgExportError: "❌ Ocorreu um erro ao processar a imagem inteira.",
        tooltipExportTable: "Salvar a tabela atual como uma imagem de alta qualidade (.png)",
        tooltipExportChart: "Salvar o gráfico e tabela como imagem (.png)",
        tooltipExportComp: "Salvar a tabela de comparação como imagem (.png)",
        tooltipExportSim: "Salvar o resultado como imagem (.png)",
        tooltipExportMasks: "Salvar a tabela de compatibilidade como imagem (.png)",
        msgLimitWeapons: "⚠️ Limite máximo de <span style='color: var(--orange-accent);'>15 armas</span> atingido!",
        msgDevelopedBy: "Desenvolvido por",
        msgItemsReport: "Relatório de Itens",
        msgCompatibleHelmetsEmpty: "Nenhum capacete compatível",
        
        titlePharmSearch: "Busca Farmacêutica",
        titleFoodSearch: "Busca Gastronômica",
        fallbackSearch: "Busca",

        // Atalhos Curtos (Siglas e Filtros)
        lblLvl: "Nv.",
        lblClassSpace: " Classe ",
        lblFilterPen: "Nível Pen. [Munição]",
        lblFilterWound: "Chance Ferir [Munição]",
        
        lblMin: "min",
        lblSec: "seg",
        
        // Dropdowns de Munição (Filtros Reversos)
        optAmmoAll: "Todas",
        optAmmoNone: "Nenhuma",
        
        // Carrinho e Exportação (Restantes)
        btnRemoveCart: "Remover",
        
        // --- TEXTOS DA TELA DE COMPARAÇÃO DE RESULTADOS ---
        compResAttribute: "ATRIBUTO",
        compResAmmoTitle: "MUNIÇÕES: ",
        compResAmmoCompat: "Compatível com: ",
        compResAmmoMaxDmg: "Dano Máximo:",
        compResBtnRemove: "Remover",
        
        compResTableHeaders: {
            itemName: "Nome do Item",
            penLevel: "Nível de Penetração",
            penetration: "Penetração",
            baseDmg: "Dano Base",
            armorDmg: "Dano à Armadura",
            bluntTrauma: "Ferimento Contuso",
            velocity: "Velocidade Inicial",
            accuracy: "Precisão",
            vrc: "Ctrl. Recuo Vertical",
            hrc: "Ctrl. Recuo Horizontal",
            woundChance: "Chance de Ferir"
        },
        
        compResAttributes: {
            cls: "Classe",
            cal: "Calibre",
            vrc: "Ctrl. Recuo Vertical",
            hrc: "Ctrl. Recuo Horizontal",
            ergo: "Ergonomia",
            ads: "Estabilidade da Arma",
            acc: "Precisão",
            hip: "Estabilidade (Sem mira)",
            range: "Alcance Efetivo",
            maxRange: "Alcance Efetivo Máx.",
            maxRangeTip: "A distância limite onde a bala mantém 100% do seu dano. Este valor já considera a arma equipada com seu melhor cano disponível.",
            muz: "Velocidade Inicial",
            fire: "Modo de Disparo",
            rof: "Cadência de Tiro",
            power: "Poder de Fogo",
            barrel: "Melhoria de Cano (Perfil da Arma)"
        },
        
        compAmmoWarning: `
            <div style="font-weight: bold; margin-bottom: 6px; color: var(--orange-accent);">Atenção (Filtros de Munição):</div>
            <div style="margin-bottom: 4px;">⚠️ Selecionar estas opções excluirá da tela de resultados as munições que possuem tais atributos.</div>
            <div>⚠️ Consecutivamente, isso pode ocultar arma(s) do catálogo de armas (apenas) abaixo se todas as opções de bala compatíveis forem filtradas simultaneamente.</div>
        `,
        
        titlesCategory: {
            weapons: "Busca de Armas",
            ammo: "Busca de Munição",
            grenades: "Busca de Granadas",
            helmets: "Busca de Capacetes",
            masks: "Busca de Máscaras",
            gasMasks: "Busca de Másc. de Gás",
            headsets: "Busca de Fones de Ouvido",
            bodyArmor: "Busca de Coletes Balísticos",
            armoredRigs: "Busca de Coletes Blindados",
            unarmoredRigs: "Busca de Coletes Não Blindados",
            backpacks: "Busca de Mochilas"
        },

        tooltipBarrel: {
            "Custom": "Beneficia apenas a customização da arma.",
            "CustomD+": "Beneficia apenas a customização da arma. (Arma: Dano de bala amplificado).",
            "CustomD-": "Beneficia apenas a customização da arma. (Arma: Dano de bala reduzido).",
            "FB": "Cano fixo.",
            "FB D-": "Cano fixo. (Arma: Dano de bala reduzido).",
            "FB D+": "Cano fixo. (Arma: Dano de bala amplificado).",
            "FBNM": "Cano fixo. (Arma: Sem customização no bocal).",
            "FBNMD+": "Cano fixo. (Arma: Sem customização no bocal e Dano de bala amplificado).",
            "FBNMD-": "Cano fixo. (Arma: Sem customização no bocal e Dano de bala reduzido).",
            "R+": "Possui cano que melhora apenas o alcance.",
            "R+ WD+": "Possui cano que melhora apenas o alcance. (Arma: Dano de bala amplificado).",
            "R+ WD-": "Possui cano que melhora apenas o alcance. (Arma: Dano de bala reduzido).",
            "D+": "Possui cano que melhora apenas o dano.",
            "D+ R+": "Possui cano que melhora o dano e o alcance.",
            "D+ R+ WD+": "Possui cano que melhora o dano e o alcance. (Arma: Dano de bala amplificado).",
            "D+ R+ WD-": "Possui cano que melhora o dano e o alcance. (Arma: Dano de bala reduzido).",
            "Default": "O cano padrão é o que apresenta o melhor desempenho balístico.",
            "Default -": "O cano padrão é o que apresenta o melhor desempenho balístico. (Arma: Dano de bala reduzido).",
            "Default +": "O cano padrão é o que apresenta o melhor desempenho balístico. (Arma: Dano de bala amplificado)."
        },
        
        // =======================================================
        // --- NOVO: TEXTOS DA TELA DE LIMITES DE DANO (GRÁFICO) ---
        // =======================================================
        titleDamageChart: "Limites de Dano por Alcance",
        lblDmgClass: "Classe:",
        lblDmgWeapon: "Arma:",
        lblDmgAmmo: "Munição:",
        btnDmgAdd: "Adicionar Gráfico e Tabela",
        btnDmgClear: "Limpar Gráfico e Tabela",
        dmgCountSuffix: " Armas restantes",
        dmgCountFull: "Limite Atingido (5/5)",
        dmgSelectOption: "-- Selecione --",
        
        dmgTableHeaders: {
            combo: "Combo (Arma + Munição)",
            damage: "Dano (Munição / Arma)",
            range: "Alcance (Base / Efetividade Máxima)",
            efficiency: "Eficiência Balística",
            remove: "Remover"
        },
        
        dmgDynamicTexts: {
            // Textos dos Dropdowns
            selectClass: "Escolha a Classe...",
            selectWeapon: "Escolha a Arma...",
            waitWeapon: "Aguardando Arma...",
            selectAmmo: "Escolha a Munição...",
            slotAvailable: "SLOT DISPONÍVEL",

            // Etiquetas (Badges)
            badgeNoGain: "Cano Neutro",
            badgeFixed: "Cano Fixo",
            badgeMitigator: "Cano Mitigador",
            badgeWepLoss: "Arma com Perda",
            badgeCanoNoBuff: "Cano Neutro",
            badgeWepGain: "Arma com Ganho",
            badgeCanoBuff: "Cano com Buff",
            badgeStandard: "Cano Padrão",
            
            // Termos de Eficiência
            effDamage: "% Dano",
            effRange: "m Alcance",
            effNeutralBadge: "NEUTRO",

            // Tooltips: Dano da Arma
            tipWepLoss: "Arma possui dano inferior ao dano base da munição.",
            tipWepGain: "Arma possui dano superior ao dano base da munição.",

            // Tooltips: Dano do Cano
            tipDanoDefault: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o dano que a arma pode causar e trocar o cano pode piorar o desempenho em outras áreas.",
            tipDanoNoBuff: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o dano.",
            tipDanoCustom: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o dano, mas trocar o cano pode lhe dar o benefício de permitir melhor customização.",
            tipDanoFixed: "Não é possível melhorar o dano pela impossibilidade de troca de cano.",
            tipDanoFixedNM: "Não é possível melhorar o dano pela impossibilidade de troca de cano e não é possível customizar o bocal.",
            tipDanoMitigateEqual: "Possui cano que é capaz de mitigar o dano inferior da arma e igualar ao dano base da bala.",
            tipDanoMitigateLoss: "Possui cano que é capaz de mitigar o dano inferior da arma, apenas amenizando a perda de dano da bala.",
            tipDanoMitigateGain: "Possui cano que é capaz de mitigar o dano inferior da arma e melhorá-lo para um dano superior ao dano base da bala.",
            tipDanoDoubleBuff: "Possui cano disponível para equipar na arma que amplifica ainda mais o dano da arma.",
            tipDanoBuff: "Possui cano disponível para equipar na arma que amplifica o dano da arma.",

            // Tooltips: Alcance do Cano
            tipRangeDefault: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o alcance e trocar o cano pode piorar o desempenho do alcance e outros status.",
            tipRangeFixed: "Não é possível melhorar o alcance pela impossibilidade de troca de cano.",
            tipRangeCustom: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o alcance, mas trocar o cano pode lhe dar o benefício de permitir melhor customização.",
            tipRangeBuff: "Possui cano disponível para equipar na arma que amplifica o alcance da arma.",
            tipRangeDPlus: "Tem opções de canos disponíveis, mas nenhuma vai melhorar o alcance. No entanto, trocar o cano pode lhe dar o benefício de aumentar o dano da arma.",

            // Tooltips: Eficiência Final
            tipEffDmgPos: "A arma apresenta um aumento de dano acima do dano base da munição.",
            tipEffDmgNeg: "A arma apresenta uma redução de dano, operando abaixo do dano base da munição.",
            tipEffRangePos: "A arma apresenta um ganho de alcance acima do alcance base da arma sem alteração de cano.",
            tipEffRangeNeg: "A arma apresenta uma redução de alcance, operando abaixo do limite base da arma.",
            tipEffNeutral: "A arma repassa o dano exato da munição e opera no seu limite exato de alcance, sem lucros ou penalidades de eficiência.",

            // Tooltips dos Cabeçalhos da Tabela
            tipHeaderDamage: "Mostra o valor de dano base da munição à esquerda e o dano máximo que a arma consegue causar à direita.",
            tipHeaderRange: "Mostra o valor base de alcance da arma à esquerda e, se disponível, o valor de alcance máximo que ela atinge usando uma alteração de cano à direita.",

            // Instrução do Gráfico
            chartInstruction: "💡 Dica: Use o scroll (roda do mouse) para dar Zoom no gráfico e clique e arraste para mover pela área.",

            // Textos Genéricos do Gráfico
            fixedDefault: "Fixo/Padrão",
            default: "Padrão",
            na: "N/A",
            damageText: "Dano",
            rangeText: "Alcance",
            removeTooltip: "Remover arma do gráfico",
            chartDistance: "Distância",
            chartType: "Tipo",
            chartTypeInitial: "Inicial",
            chartTypeFinal: "Final",
            chartTypeSimulated: "Final Simulado",
            
            // Textos dos Eixos e Tabela (Nova Limpeza)
            axisDistance: "Distância (Metros)",
            axisDamage: "Dano Total",
            colRof: "Cadência",
            tipRof: "Disparos por minuto (RPM)"
        },
        
        dmgInfoModal: {
            title: "Metodologia dos Dados",
            tooltip: "Entenda a metodologia dos dados",
            p1: "<b>1.</b> Os dados de dano e alcance são baseados no desempenho das armas quando equipadas com os melhores canos disponíveis para cada uma delas.",
            p2: "<b>2.</b> O gráfico ilustra a queda de dano com base em dados obtidos em testes práticos. Apenas a curva exata entre o dano inicial e o final não é mapeada, visto que esse decaimento não possui um padrão fixo no jogo e dificultaria a manutenção do banco de dados.",
            p3: "<b>3.</b> Internamente, o jogo utiliza medidas de distância fracionadas (ex: 54.9 metros). Como os valores fornecidos no campo de tiro são inteiros e arredondados, a lógica teórica adotada por esta ferramenta considera cada metro marcado como um intervalo (ex: a marca de 1 metro engloba de 1.0m a 1.9m).",
            p4: "<b>4.</b> Os valores de dano inicial e final são absolutos nas distâncias registradas e não sofrem alterações. Ao atingir o limite máximo de alcance registrado, o valor do dano final estabiliza e se mantém infinito para os metros subsequentes.",
            btnClose: "Fechar"
        },
        
        // =======================================================
        // --- NOVO: TEXTOS DA TELA DO SIMULADOR BALÍSTICO ---
        // =======================================================
        navSimulator: "Simulador Balístico:<br><span style='font-size: 0.85em; color: var(--text-dim); font-weight: normal;'>Arma vs Proteção</span>",
        titleSimulator: "Simulador Balístico: Arma vs Proteção",
        lblSimAtkTitle: "Ataque (Arma e Munição)",
        lblSimClass: "Classe da Arma:",
        lblSimWeapon: "Arma (Afeta o Dano Base):",
        lblSimAmmo: "Munição (Projétil):",
        lblSimDefTitle: "Defesa (Armadura)",
        lblSimRepWeaponTitle: "Arma",
        lblSimRepAmmoTitle: "Munição",
        lblSimRepArmorTitle: "Colete Alvo",
        lblSimArmorType: "Categoria de Proteção:",
        lblSimArmor: "Item de Proteção:",
        lblSimArmorClass: "Classe:",
        lblSimArmorDur: "Durabilidade Máxima:",
        simPlaceholderText: "Selecione a Arma, Munição e Colete para iniciar a simulação de combate.",
        lblSimReportTitle: "Análise de Penetração e Trauma",
        lblSimBarTitle: "CHANCE DE PENETRAÇÃO",
        
        // Status do Equipamento
        lblSimProjStatus: "Status do Projétil",
        lblSimPierceLevel: "Nível de Perfuração:",
        lblSimExactPen: "Penetração:",
        lblSimArmorDmg: "Dano de Blindagem:",
        lblSimBaseDmg: "Dano Base (Arma+Munição):",
        lblSimBluntDmg: "Dano Ferimento Contuso (Arma+Munição):",
        
        lblSimArmorStatus: "Status da Blindagem",
        lblSimArmorClassLabel: "Classe da Blindagem:",
        lblSimArmorMaterialLabel: "Material:",
        lblSimArmorMaxDur: "Durabilidade Máxima:",
        lblSimArmorCurDur: "Durabilidade Atual:",
        lblSimArmorAreas: "Áreas Protegidas:",
        lblSimDurabilityState: "Estado da Blindagem:",

        // Caixas de Dano
        lblSimDmgCloseTitle: "Dano Inicial",
        lblSimResPenClose: "Dano de Penetração",
        lblSimResArmorClose: "Tiros para Desgaste Crítico <span style=\"text-transform: none;\">(100% Penetração)</span>",
        lblSimResKillClose: "Tiros para Matar",
        lblSimResAvgKill: "Média para Matar",

        lblSimDmgFarTitle: "Dano Final",
        lblSimResPenFar: "Dano de Penetração",
        lblSimResArmorFar: "Tiros para Desgaste Crítico <span style=\"text-transform: none;\">(100% Penetração)</span>",
        lblSimResKillFar: "Tiros para Matar",
        lblSimResAvgKill: "Média para Matar",

        lblSimWarnImp: "Importante:",
        lblSimWarnTxt: "O cálculo considera que você acertou todos os chumbos ou flechetes de cada disparo.",
        
        simDynamicTexts: {
            fullPen: "PENETRAÇÃO TOTAL",
            partialPen: "PENETRAÇÃO PARCIAL",
            lowPen: "BAIXA PENETRAÇÃO",
            veryLowPen: "PENETRAÇÃO EXTREMAMENTE BAIXA",
            noPen: "SEM PENETRAÇÃO",
            descFull: "O Nível de Perfuração ({0}) supera a armadura Nível {1} — todo tiro atravessa.",
            descPartial: "O Nível de Perfuração ({0}) empata com a armadura Nível {1} — maioria dos tiros atravessa com dano reduzido.",
            descLow: "O Nível de Perfuração ({0}) é inferior à armadura Nível {1} — a penetração é difícil e o dano é reduzido.",
            selectClass: "Escolha a Classe...",
            selectWeapon: "Escolha a Arma...",
            selectAmmo: "Escolha a Munição...",
            selectArmorCategory: "Escolha a Categoria...",
            selectArmor: "Escolha a Proteção...",
            chest: "(Tórax)",
            head: "(Cabeça)",
            face: "(Face)",
            rangeClose: "Alcance: 0m a {0}m",
            rangeFar: "Alcance Final: {0}m+",
            initial: "(Inicial)",
            final: "(Final)",
            optHelmets: "Capacetes",
            optMasks: "Máscaras",
            optBodyArmor: "Coletes Balísticos",
            optRigs: "Coletes Blindados",
            optAll: "Coletes Balísticos e Coletes Blindados"
        },

        simInfoModal: {
            title: "Metodologia do Simulador",
            tooltip: "Entenda a metodologia dos cálculos",
            p1: "<b>1.</b> Os dados de dano e alcance são baseados no desempenho das armas quando equipadas com os melhores canos disponíveis para cada modelo.",
            p2: "<b>2.</b> Os resultados mostrados são puramente calculados, e não coletados manualmente. Isso foi feito para evitar dificuldades na manutenção do banco de dados.",
            p3: "<b>3.</b> Devido à grande proporção matemática, é difícil evitar margens de erro quando a diferença de blindagem e munição ultrapassa 3 níveis. Nesse ponto, minha calibração entra em cena. O ajuste não elimina as variáveis do jogo, mas ancora os resultados perto da realidade, mantendo o erro entre acertos perfeitos ou variações de no máximo ±3 a ±4 tiros.",
            btnClose: "Fechar"
        },

        simArmorAreasMap: {
            "Chest": "Tórax",
            "Upper Abdomen": "Abdômen Superior",
            "Lower Abdomen": "Abdômen Inferior",
            "Shoulder": "Ombro",
            "Head": "Cabeça",
            "Ears": "Orelhas",
            "Face": "Face"
        },
        
        // ==========================================
        // TEXTOS DAS TABELAS DE BUSCA (COLUNAS E CRITÉRIOS)
        // ==========================================
        views: {
            weapons: {
                criteria: ["Alfabético", "Controle de Recuo Vertical", "Controle de Recuo Horizontal", "Ergonomia", "Estabilidade da Arma", "Precisão", "Estabilidade sem Mirar", "Distância Efetiva", "Velocidade de Saída", "Modo de Disparo", "Cadência", "Poder de Fogo", "Melhoria de Cano (Perfil da Arma)"],
                cols: {
                    name: "Nome", nameTip: "O nome da arma.",
                    cls: "Classe", clsTip: "A categoria a que a arma pertence.",
                    cal: "Calibre", calTip: "O tipo de munição utilizada.",
                    vrc: "CRV", vrcTip: "Controle de recuo vertical.",
                    hrc: "CRH", hrcTip: "Controle de recuo horizontal.",
                    ergo: "Ergo", ergoTip: "Ergonomia da arma.",
                    ads: "Esta.DA", adsTip: "Estabilidade de Arma (Mira).",
                    acc: "Prec", accTip: "Precisão base da arma.",
                    hip: "Esta.SM", hipTip: "Estabilidade de Arma (Sem mira).",
                    range: "Dis(m)", rangeTip: "Alcance efetivo.",
                    muz: "Vel.bo", muzTip: "Velocidade de Saída.",
                    fire: "ModoDisparo", fireTip: "Modos de disparo.",
                    rof: "Cad", rofTip: "Cadência de tiro.",
                    power: "Poder.DFG", powerTip: "Poder de fogo estimado.",
                    barrel: "Melhoria de Cano (Perfil da Arma)", barrelTip: "Customização de cano e perfil da arma."
                }
            },
            ammo: {
                criteria: ["Alfabético", "Nível de Penetração", "Penetração", "Dano Base", "Dano de Blindagem", "Ferimento Contuso", "Velocidade Inicial", "Precisão", "Controle de Recuo Vertical", "Controle de Recuo Horizontal", "Chance de Ferir"],
                cols: {
                    name: "Nome", nameTip: "O nome da munição.",
                    lv: "Nv", lvTip: "Nível de penetração (Tier).",
                    pen: "Pen", penTip: "Penetração.",
                    dmg: "Dano Base", dmgTip: "Dano da munição.",
                    armDmg: "Dano Blindagem", armDmgTip: "A eficiência da munição em reduzir a durabilidade do colete inimigo.",
                    blunt: "Fer. Contuso", bluntTip: "Nível de ferimento contuso.",
                    vel: "Vel(m/s)", velTip: "Velocidade do projétil.",
                    acc: "Prec", accTip: "Precisão.",
                    vrc: "CRV", vrcTip: "Controle de recuo vertical.",
                    hrc: "CRH", hrcTip: "Controle de recuo horizontal.",
                    wound: "Chance Ferir", woundTip: "Chance de causar ferimento/sangramento.",
                    cal: "Calibre", calTip: "O calibre da munição."
                }
            },
            grenades: {
                criteria: ["Alfabético", "Delay de Explosão", "Alcance", "Dano em Blindagem", "Penetração", "Fragmentos", "Tipo de Frags.", "Tempo de Efeito"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    delay: "Delay Explosão", delayTip: "O tempo mínimo e máximo em segundos para a detonação.",
                    range: "Alcance", rangeTip: "O raio efetivo da granada.",
                    armDmg: "Dano Blindagem", armDmgTip: "O potencial de dano contra blindagem.",
                    pen: "Penetração", penTip: "A capacidade de penetrar blindagens.",
                    frags: "Fragmentos", fragsTip: "A quantidade de fragmentos gerados.",
                    fragType: "Tipo Frags.", fragTypeTip: "O tipo de material dos fragmentos.",
                    time: "Tempo Efeito", timeTip: "A duração em segundos de efeitos contínuos (fumaça, gás, fogo)."
                }
            },
            helmets: {
                // criteria: ["Alfabético", "Peso", "Durabilidade", "Classe de Blindagem", "Bloqueio de Som", "Penalidade de Movimento", "Ergonomia", "Área Protegida", "Chance de Ricochete", "Captura de Som", "Redução de Ruído", "Acessório", "Classe Máxima da Máscara Compatível"],
                criteria: ["Alfabético", "Peso", "Durabilidade", "Classe de Blindagem", "Bloqueio de Som", "Penalidade de Movimento", "Ergonomia", "Área Protegida", "Captura de Som", "Redução de Ruído", "Acessório", "Classe Máxima da Máscara Compatível"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "O peso do capacete.",
                    dur: "Dur.", durTip: "Pontos totais de durabilidade.",
                    cls: "Cl", clsTip: "Classe de Blindagem.",
                    mat: "Material", matTip: "O material principal de fabricação.",
                    block: "Bloq. Som", blockTip: "O nível de bloqueio sonoro que o capacete causa.",
                    mov: "Vel.M", movTip: "A porcentagem de penalidade na velocidade de movimento.",
                    ergo: "Ergo", ergoTip: "A penalidade nos pontos de ergonomia.",
                    area: "Área Protegida", areaTip: "As partes da cabeça que o capacete protege.",
                    rico: "Ricoch", ricoTip: "A chance de um projétil ricochetear no capacete.",
                    pickup: "Capt. Som", pickupTip: "A potência do fone de ouvido embutido para captar sons do ambiente.",
                    noise: "Red.Ru", noiseTip: "A potência do fone de ouvido embutido para reduzir ruídos altos.",
                    acc: "Acessório", accTip: "Compatibilidade de máscara ou acessório tático.",
                    maxMask: "Cl Max Masc", maxMaskTip: "Mostra a Classe máxima da máscara compatível."
                }
            },
            masks: {
                // criteria: ["Alfabético", "Peso", "Durabilidade", "Classe de Blindagem", "Chance de Ricochete"],
                criteria: ["Alfabético", "Peso", "Durabilidade", "Classe de Blindagem"],
                cols: {
                    name: "Nome", nameTip: "O nome da máscara.",
                    weight: "Peso", weightTip: "O peso do item.",
                    dur: "Durabilidade", durTip: "Pontos totais de durabilidade.",
                    cls: "Cl", clsTip: "Classe de Blindagem.",
                    mat: "Material", matTip: "O material principal.",
                    rico: "Chance de Ricochete", ricoTip: "A chance de um projétil ricochetear."
                }
            },
            gasMasks: {
                criteria: ["Alfabético", "Peso", "Durabilidade", "Anti-Veneno", "Anti-Flash"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "O peso da máscara.",
                    dur: "Durabilidade", durTip: "Pontos totais de durabilidade.",
                    poison: "Anti-Veneno", poisonTip: "Nível de proteção contra gás venenoso.",
                    flash: "Anti-Flash", flashTip: "Nível de proteção contra granadas de luz."
                }
            },
            headsets: {
                criteria: ["Alfabético", "Peso", "Captação de Som", "Redução de Ruído"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "O peso do fone.",
                    pickup: "Captador de Som", pickupTip: "O nível de amplificação de sons do ambiente.",
                    noise: "Redução de Ruído", noiseTip: "O nível de redução de ruídos altos, como tiros."
                }
            },
            bodyArmor: {
                criteria: ["Alfabético", "Peso", "Classe de Blindagem", "Durabilidade", "Material", "Penalidade de Movimento", "Ergonomia", "Área Protegida"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "O peso do colete.",
                    cls: "Cl", clsTip: "Classe de Blindagem.",
                    dur: "Durabilidade", durTip: "Pontos totais de durabilidade.",
                    mat: "Material", matTip: "Material principal.",
                    mov: "Vel.M", movTip: "A penalidade de velocidade de movimento.",
                    ergo: "Ergo", ergoTip: "Penalidade de ergonomia.",
                    area: "Área Protegida", areaTip: "Áreas protegidas do corpo."
                }
            },
            armoredRigs: {
                criteria: ["Alfabético", "Peso", "Classe de Blindagem", "Durabilidade", "Penalidade de Movimento", "Ergonomia", "Armazenamento", "Área Protegida", "Conjunto de Blocos (HxV)"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "O peso do colete.",
                    cls: "Cl", clsTip: "Classe de Blindagem.",
                    dur: "Durabilidade", durTip: "Pontos totais de durabilidade.",
                    mat: "Material", matTip: "Material de fabricação.",
                    mov: "Vel.M", movTip: "A porcentagem de penalidade na velocidade de movimento.",
                    ergo: "Ergo", ergoTip: "A penalidade nos pontos de ergonomia.",
                    space: "Esp", spaceTip: "A quantidade de slots de armazenamento que o colete oferece.",
                    area: "Área Protegida", areaTip: "As partes do corpo que o colete protege.",
                    layout: "Conj d. blocos (HxV)", layoutTip: "O layout e o tamanho dos slots internos (Formato: Horizontal x Vertical)"
                }
            },
            unarmoredRigs: {
                criteria: ["Alfabético", "Peso", "Armazenamento", "Conjunto de Blocos (HxV)", "+Espaço p/ Armaz. -Espaço Consumido"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "Peso do item.",
                    space: "Espaço", spaceTip: "A quantidade de slots de armazenamento que o colete oferece.",
                    unfold: "Desdobrada", unfoldTip: "O espaço que o item ocupa no inventário no formato 'Horizontal x Vertical'.",
                    fold: "Dobrada", foldTip: "O espaço que o item ocupa quando dobrado, também no formato 'HxV'.",
                    layout: "Conj d. blocos (HxV)", layoutTip: "O layout e o tamanho dos bolsos/compartimentos internos.",
                    eff: "+Armaz -Espaço", effTip: "Saldo de armazenamento: mostra se o item cria mais espaço do que consome no inventário."
                }
            },
            backpacks: {
                criteria: ["Alfabético", "Peso", "Armazenamento", "Conjunto de Blocos (HxV)", "+Espaço p/ Armaz. -Espaço Consumido"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    weight: "Peso", weightTip: "Peso do item.",
                    space: "Espaço", spaceTip: "A quantidade de slots de armazenamento que a mochila oferece.",
                    unfold: "Desdobrada", unfoldTip: "O espaço que o item ocupa no inventário no formato 'Horizontal x Vertical'.",
                    fold: "Dobrada", foldTip: "O espaço que o item ocupa quando dobrado, também no formato 'HxV'.",
                    layout: "Conj d. blocos (HxV)", layoutTip: "O layout e o tamanho dos bolsos/compartimentos internos.",
                    eff: "+Armaz -Espaço", effTip: "Saldo de armazenamento: mostra se o item cria mais espaço do que consome no inventário."
                }
            },
            painkillers: {
                criteria: ["Usos", "Duração", "Desidratação", "Duração Máxima"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    uses: "Usos", usesTip: "Quantidade de vezes que o item pode ser usado.",
                    dur: "Duração", durTip: "Tempo do efeito em segundos para um único uso.",
                    dehyd: "Desidratação", dehydTip: "Pontos de hidratação perdidos por uso.",
                    delay: "Tempo de Atraso", delayTip: "Tempo em segundos para consumir o item.",
                    maxDur: "Duração Máx.", maxDurTip: "Tempo de cobertura máximo gerado ao gastar 100% das cargas do analgésico.",
                    maxDehyd: "Desidratação Máx.", maxDehydTip: "Perda total de hidratação caso você consuma todos os usos do analgésico."
                }
            },
            bandages: {
                criteria: ["Padrão"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    uses: "Usos", usesTip: "Quantidade de vezes que o item pode ser usado.",
                    delay: "Tempo de Atraso", delayTip: "Tempo em segundos para aplicar o item.",
                    cost: "Custo Durabilidade", costTip: "Pontos de durabilidade gastos por uso"
                }
            },
            surgical: {
                criteria: ["Usos", "Tempo de Atraso", "Desidratação", "Recuperação por Uso", "Espaço (HxV)"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    uses: "Usos", usesTip: "Quantidade de vezes que o item pode ser usado.",
                    delay: "Tempo de Atraso", delayTip: "Tempo em segundos para aplicar o item.",
                    dehyd: "Desidratação", dehydTip: "Pontos de hidratação perdidos ao usar o item.",
                    hp: "Rec. HP", hpTip: "Pontos de vida (HP) recuperados por uso.",
                    cost: "Custo Dur.", costTip: "Pontos de durabilidade gastos por uso em um kit médico.",
                    space: "Espaço (HxV)", spaceTip: "Formato 'Horizontal x Vertical' dos slots ocupados."
                }
            },
            nebulizers: {
                criteria: ["Padrão"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    uses: "Usos", usesTip: "Quantidade de vezes que o item pode ser usado.",
                    delay: "Tempo de Atraso", delayTip: "Tempo em segundos para aplicar o item.",
                    cost: "Custo Durabilidade", costTip: "Pontos de durabilidade gastos por uso"
                }
            },
            medkits: {
                criteria: ["Durabilidade", "Desidratação", "Velocidade de Cura", "Delay", "Espaço (HxV)", "Durabilidade por Slot"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    dur: "Durabilidade", durTip: "Pontos totais de durabilidade do kit.",
                    dehyd: "Desidratação", dehydTip: "Pontos de hidratação perdidos ao usar o kit.",
                    speed: "Vel. Cura", speedTip: "Velocidade com que o kit cura ferimentos.",
                    delay: "Delay", delayTip: "Tempo em segundos para aplicar o item.",
                    cost: "Custo Durabilidade", costTip: "Pontos de durabilidade gastos por uso",
                    space: "Espaço (HxV)", spaceTip: "Formato 'Horizontal x Vertical' dos slots ocupados.",
                    eff: "Durab. p/ Slot", effTip: "Custo-benefício de DURABILIDADE POR SLOT."
                }
            },
            stimulants: {
                criteria: ["Padrão"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    effect: "Efeito Principal", effectTip: "O principal bônus fornecido pelo estimulante.",
                    dur: "Duração", durTip: "Tempo do efeito em segundos.",
                    dehyd: "Desidratação", dehydTip: "Pontos de hidratação perdidos ao usar o item.",
                    energy: "Red. Energia", energyTip: "Pontos de energia perdidos ao usar o item.",
                    delay: "Delay", delayTip: "Tempo em segundos para aplicar o item."
                }
            },
            food: {
                criteria: ["Alfabético", "Hidratação", "Energia", "Hidratação por Slot", "Energia por Slot"],
                cols: {
                    name: "Nome", nameTip: "O nome do item.",
                    hyd: "Hidratação", hydTip: "Quantidade de hidratação que o item recupera ou deduz.",
                    eng: "Energia", engTip: "Pontos de energia que o item recupera ou Deduz.",
                    stam: "Rec.Stamina", stamTip: "Nível de recuperação de estamina (fôlego).",
                    space: "Espaço (HxV)", spaceTip: "Formato 'Horizontal x Vertical' que indica o número de slots ocupados pelo item no inventário.",
                    hydSlot: "Hidrat.Slot", hydSlotTip: "Custo-benefício de HIDRATAÇÃO POR SLOT.",
                    engSlot: "Energ.Slot", engSlotTip: "Custo-benefício de ENERGIA POR SLOT.",
                    delay: "Delay", delayTip: "Tempo em segundos para consumir completamente o item."
                }
            }
        },

        titleMaskComp: "Compatibilidade: Máscaras x Capacetes",
        maskCompHeaders: {
            mask: "Máscara",
            helmets: "Capacetes Compatíveis"
        },
        maskFilterModal: {
            title: "Filtro Unificado de Classes",
            desc: "Marque as classes que você deseja <b>OCULTAR</b> (afeta máscaras e capacetes simultaneamente).",
            columnTitle: "Classes Encontradas",
            btnClean: "Limpar",
            btnApply: "Aplicar",
            btnCancel: "Cancelar"
        },
        filterModals: {
            titleWeapons: "Ocultar Armas - Marque o que deseja OCULTAR",
            titleAmmo: "Filtros de Munição - Marque o que deseja OCULTAR",
            titleHelmets: "Filtros de Capacetes - Marque o que deseja OCULTAR",
            titleArmor: "Filtros de Coletes - Marque o que deseja OCULTAR",
            titleRigs: "Filtro de Coletes Blindados - Marque o que deseja OCULTAR",
            colCategory: "Categoria",
            colCaliber: "Calibre",
            colFireMode: "Modo de Disparo",
            colFirepower: "Poder de Fogo",
            colBarrel: "Melhoria de Cano (Perfil da Arma)",
            colLevels: "Níveis (Nv)",
            colWound: "Chance de Ferir",
            colClassCl: "Classe (Cl)",
            colSoundBlock: "Bloqueio Sonoro",
            colArea: "Área Protegida",
            colRico: "Ricochete",
            colAccessory: "Acessório",
            colMaxMask: "Máscara (Classe Máxima)",
            colArmorClass: "Classe de Blindagem"
        },
        
        // =====================================================================
        // O NOVO DATA DICT PARA O PORTUGUÊS (Dicionário Reverso de CSV)
        // =====================================================================
        dataDict: {
            weapons: {
                Classe: {
                    "ASSAULT RIFLE": "Rifle de assalto",
                    "SUBMACHINE GUN": "Submetralhadora",
                    "CARBINE": "Carabina",
                    "MARKSMAN RIFLE": "Fuzil DMR",
                    "BOLT-ACTION RIFLE": "Rifle de ferrolho",
                    "SHOTGUN": "Escopeta",
                    "LIGHT MACHINE GUN": "Metralhadora leve",
                    "PISTOL": "Pistola"
                },
                ModoDisparo: {
                    "Bolt-Action": "A.Ferrolho",
                    "Pump-Action": "A.Bombeamento",
                    "Semi": "Semi",
                    "Full": "Auto",
                    "3-RB": "3-RB",
                    "2-RB": "2-RB",
                    "Semi, Full": "Semi, Auto",
                    "2-RB, Semi, Full": "2-RB, Semi, Auto",
                    "3-RB, Semi, Full": "3-RB, Semi, Auto"
                },
                PoderFogo: {
                    "Ultra High": "Ultra-Alto",
                    "High": "Alto",
                    "Mid-High": "Médio-Alto",
                    "Medium": "Médio",
                    "Mid-Low": "Médio-Baixo",
                    "Low": "Baixo"
                },
                TipoCano: {
                    "FB D-": "CF D-",
                    "FB": "CF",
                    "FB D+": "CF D+",
                    "FBNM": "CFSB",
                    "FBNMD+": "CFSB D+",
                    "FBNMD-": "CFSB D-",
                    "Default": "Padrão",
                    "Default -": "Padrão -",
                    "Default +": "Padrão +",
                    "R+": "A+",
                    "R+ WD+": "A+ DA+",
                    "R+ WD-": "A+ DA-",
                    "D+": "D+",
                    "D+ R+": "D+ A+",
                    "D+ R+ WD+": "D+ A+ DA+",
                    "D+ R+ WD-": "D+ A+ DA-",
                    "Custom": "Custom",
                    "CustomD+": "Custom D+",
                    "CustomD-": "Custom D-"
                }
            },
            ammo: {
                ChanceFerir: {
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto",
                    "/////": "/////"
                }
            },
            grenades: {
                Alcance: {
                    "Small": "Pequeno",
                    "Standard": "Padrão",
                    "Large": "Grande",
                    "Very Large": "Muito Grande"
                },
                DanoBlindagem: {
                    "Standard": "Padrão",
                    "Mid-High": "Superior"
                },
                Penetracao: {
                    "Standard": "Padrão",
                    "Mid-High": "Superior"
                },
                Fragmentos: {
                    "Small": "Pequeno",
                    "Large": "Grande"
                },
                TipoFragmento: {
                    "Steel Piece": "Peça de aço",
                    "Iron Piece": "Peça de ferro"
                }
            },
            helmets: {
                AreaProtegida: {
                    "Head": "Cabeça",
                    "Head, Ears": "Cabeça, Ouvidos",
                    "Head, Ears, Face": "Cabeça, Ouvidos, Rosto"
                },
                BloqueioSom: {
                    "Low": "Baixo",
                    "Moderate": "Moderado",
                    "Severe": "Grave"
                },
                Ricochete: {
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto"
                },
                Acessorio: {
                    "/////": "/////",
                    "TE": "Equip.TA",
                    "Mask": "Máscara",
                    "Mask, TE": "Máscara, Equip.TA"
                },
                CaptacaoSom: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte"
                },
                ReducaoRuido: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte"
                },
                Material: {
                    "Composite": "Composto",
                    "Aramid": "Aramida",
                    "Polyethylene": "Polietileno",
                    "Hardened Steel": "Aço endurecido",
                    "Titanium": "Titânio",
                    "Aluminum": "Alumínio"
                }
            },
            masks: {
                Material: {
                    "Hardened Steel": "Aço endurecido",
                    "Glass": "Vidro",
                    "Composite": "Composto",
                    "Aluminum": "Alumínio"
                },
                Ricochete: {
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto"
                }
            },
            bodyArmor: {
                Material: {
                    "Composite": "Composto",
                    "Aramid": "Aramida",
                    "Polyethylene": "Polietileno",
                    "Hardened Steel": "Aço endurecido",
                    "Titanium": "Titânio",
                    "Ceramic": "Cerâmica",
                    "Aluminum": "Alumínio"
                },
                AreaProtegida: {
                    "Chest": "Tórax",
                    "Chest, Upper Abdomen": "Tórax, Abdômen Superior",
                    "Chest, Shoulder, Upper Abdomen": "Tórax, Ombro, Abdômen Superior",
                    "Chest, Upper Abdomen, Lower Abdomen": "Tórax, Abdômen Superior, Abdômen Inferior",
                    "Chest, Shoulder, Upper Abdomen, Lower Abdomen": "Tórax, Ombro, Abdômen Superior, Abdômen Inferior"
                }
            },
            armoredRigs: {
                Material: {
                    "Composite": "Composto",
                    "Aramid": "Aramida",
                    "Polyethylene": "Polietileno",
                    "Hardened Steel": "Aço endurecido",
                    "Titanium": "Titânio",
                    "Ceramic": "Cerâmica",
                    "Aluminum": "Alumínio"
                },
                AreaProtegida: {
                    "Chest": "Tórax",
                    "Chest, Upper Abdomen": "Tórax, Abdômen Superior",
                    "Chest, Upper Abdomen, Lower Abdomen": "Tórax, Abdômen Superior, Abdômen Inferior",
                    "Chest, Shoulder, Upper Abdomen, Lower Abdomen": "Tórax, Ombro, Abdômen Superior e Inferior"
                }
            },
            gasMasks: {
                AntiVeneno: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte"
                },
                AntiFlash: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte",
                    "/////": "/////"
                }
            },
            headsets: {
                CaptacaoSom: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte"
                },
                ReducaoRuido: {
                    "Bad": "Fraco",
                    "Medium": "Médio",
                    "Strong": "Forte"
                }
            },
            food_all: {
                RecuperacaoStamina: {
                    "None": "/////",
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto"
                }
            },
            food_items: {
                RecuperacaoStamina: {
                    "None": "/////",
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto"
                }
            },
            food_beverages: {
                RecuperacaoStamina: {
                    "None": "/////",
                    "Low": "Baixo",
                    "Medium": "Médio",
                    "High": "Alto"
                }
            }
        }
    },
    
    en: {
        appTitle: "ABIDB Web",
        navSearch: "Item Search",
        navCompare: "Comparison",
        toggleLangBtn: "Mudar para Português",
        navDamage: "Damage Limits by Range",
        navMaskComp: "Compatibility<br><span style='font-size: 0.85em; color: var(--text-dim); font-weight: normal;'>Masks x Helmets</span>",
        // --- NOVO: Textos do Menu e Telas de Artigos/Changelog ---
        navArticles: "Articles & Guides",
        navChangelog: "Changelog",
        navChangelogReading: "Reading date...",
        navAbout: "About the Tool",
        titleAbout: "About the Tool",
        lblAboutLoading: "Loading developer info...",
        lblAboutError: "Error reading the developer info.",

        aboutFileName: "about.md",

        titleArticles: "Articles & Guides",
        lblArticlesMenu: "Available Topics",
        lblArticlesPlaceholder: "Select a topic from the side menu to start reading.",
        lblArticlesError: "Error loading the article.",
        
        titleChangelog: "Update History (Changelog)",
        lblChangelogLoading: "Loading update history...",
        lblChangelogError: "Error loading the changelog.",
        
        // Textos da aba: Item Search with Filters
        titleSearch: "Item Search with Filters",
        descSearch: "Select a category and filters to search for equipment.",
        lblCategory: "Category:",
        lblCriteria: "Sort By:",
        lblOrder: "Order:",
        orderAsc: "Ascending",
        orderDesc: "Descending",
        btnFilter: "Filters",
        btnSave: "Save results",
        btnSearchBack: "Back",
        btnFilterReset: "Reset Filters",
        btnFilterConfirm: "Confirm Filters",
        btnFilterCancel: "Cancel",
        lblCount: "Showing: 0 items",
        gridPlaceholder1: "Select a category to load data...",

        // Textos dos Dropdowns de Subcategorias
        lblMedicalCat: "Pharmaceutical Category:",
        optMedPainkillers: "Painkillers",
        optMedBandages: "Bandages",
        optMedSurgical: "Surgical Kits",
        optMedNebulizers: "Nebulizers",
        optMedMedkits: "Medkits",
        optMedStimulants: "Stimulants",

        lblFoodCat: "Food & Beverage Category:",
        optFoodAll: "All foods and beverages",
        optFoodItems: "Food",
        optFoodBeverages: "Beverages",
        
        // Textos da aba: Comparison and Compatibility
        titleCompare: "Comparison and Compatibility",
        descCompare: "Choose one of the comparison modules below:",
        btnCompWeapons: "Compare weapons",
        btnCompMasks: "Check mask and helmet compatibility",
        btnCompBallistics: "Compare Ballistic Efficiency",
        gridPlaceholder2: "No module selected.",

        // --- MENSAGENS DO SISTEMA E TOOLTIPS DINÂMICOS ---
        msgDownloading: "Downloading database...",
        msgDbReady: "Database ready! Select a category.",
        // Menus e Filtros de Interface
        lblMenuTools: "DATA TOOLS",
        lblMenuKnowledge: "KNOWLEDGE",
        navCompareWeapons: "Weapon Comparison",
        lblAmmoCat: "Category:",
        lblAmmoWep: "Weapon:",
        btnAmmoReset: "Reset Selections & Filters",
        tooltipFilter: "Hide items: Click here to open the panel and filter out specific features you don't want to see in the table.",
        
        // Tela de Comparação
        titleCompareWeapons: "Weapon Comparison",
        lblCompSelectedTitle: "Selected Weapons",
        lblCompEmpty: "No weapons selected. Choose weapons below.",
        btnCompCompare: "Compare Selected Weapons",
        btnCompClearAll: "Clear All Selections",
        lblCompFilterTitle: "Exclusion Filters (Check the features you want to remove from the catalog)",
        btnCompResetFilters: "Clear Filters",
        lblCompResultsTitle: "Comparison Results",
        btnCompBack: "Back to Selection",
        
        // Tela de Máscaras
        titleMaskComp: "Compatibility: Masks x Helmets",
        btnMaskFilter: "Class Filters",
        btnMaskResetQuick: "Clear Filters",
        
        // Artigos e Botões Gerais
        btnArticlesBack: "Back to List",
        lblUpdated: "Updated:",
        
        // Exportação e Alertas
        msgZeroItemsLoad: "Showing: 0 items (Data not loaded)",
        msgShowingItemsPrefix: "Showing: ",
        msgShowingItemsSuffix: " items",
        tooltipClickSort: "Click to sort",
        tooltipFaceProtection: "Facial protection already built into this helmet.",
        msgExporting: "⏳ Exporting...",
        msgExportResults: "📷 Export Results",
        msgExportError: "❌ An error occurred while processing the full image.",
        tooltipExportTable: "Save the current table as a high-quality image (.png)",
        tooltipExportChart: "Save the chart and table as a high-quality image (.png)",
        tooltipExportComp: "Save the comparison table as an image (.png)",
        tooltipExportSim: "Save the result as an image (.png)",
        tooltipExportMasks: "Save the compatibility table as a high-quality image (.png)",
        msgLimitWeapons: "⚠️ Maximum limit of <span style='color: var(--orange-accent);'>15 weapons</span> reached!",
        msgDevelopedBy: "Developed by",
        msgItemsReport: "Items Report",
        msgCompatibleHelmetsEmpty: "No compatible helmets",

        titlePharmSearch: "Pharmaceutical Search",
        titleFoodSearch: "Food & Beverage Search",
        fallbackSearch: "Search",

        // Atalhos Curtos (Siglas e Filtros)
        lblLvl: "Lv.",
        lblClassSpace: " Class ",
        lblFilterPen: "Pen. Level [Ammo]",
        lblFilterWound: "Wound Chance [Ammo]",

        lblMin: "min",
        lblSec: "sec",

        // Dropdowns de Munição (Filtros Reversos)
        optAmmoAll: "All",
        optAmmoNone: "None",
        
        // Carrinho e Exportação (Restantes)
        btnRemoveCart: "Remove",
        
        // --- TEXTOS DA TELA DE COMPARAÇÃO DE RESULTADOS ---
        compResAttribute: "ATTRIBUTE",
        compResAmmoTitle: "AMMO: ",
        compResAmmoCompat: "Compatible with: ",
        compResAmmoMaxDmg: "Max Dmg:",
        compResBtnRemove: "Remove",

        compResTableHeaders: {
            itemName: "Item Name",
            penLevel: "Pen. Level",
            penetration: "Penetration",
            baseDmg: "Base Damage",
            armorDmg: "Armor Damage",
            bluntTrauma: "Blunt Trauma",
            velocity: "Muzzle Velocity",
            accuracy: "Accuracy",
            vrc: "Vertical Recoil Ctrl.",
            hrc: "Horizontal Recoil Ctrl.",
            woundChance: "Wound Chance"
        },
        
        compResAttributes: {
            cls: "Class",
            cal: "Caliber",
            vrc: "Vertical Recoil Ctrl.",
            hrc: "Horizontal Recoil Ctrl.",
            ergo: "Ergonomics",
            ads: "Weapon Stability",
            acc: "Accuracy",
            hip: "Hip-Fire Stability",
            range: "Effective Range",
            maxRange: "Max Effective Range",
            maxRangeTip: "The distance limit where the bullet retains 100% of its damage. This value already considers the weapon equipped with its best available barrel.",
            muz: "Muzzle Velocity",
            fire: "Fire Mode",
            rof: "Rate of Fire",
            power: "Firepower",
            barrel: "Barrel Upgrade (Weapon Profile)"
        },
        
        compAmmoWarning: `
            <div style="font-weight: bold; margin-bottom: 6px; color: var(--orange-accent);">Attention (Ammo Filters):</div>
            <div style="margin-bottom: 4px;">⚠️ Selecting these options will exclude ammo with such attributes from the results screen.</div>
            <div>⚠️ Consequently, this may hide weapon(s) from the weapon catalog (only) below if all compatible bullet options are filtered simultaneously.</div>
        `,

        titlesCategory: {
            weapons: "Weapon Search",
            ammo: "Ammo Search",
            grenades: "Grenade Search",
            helmets: "Helmet Search",
            masks: "Mask Search",
            gasMasks: "Gas Mask Search",
            headsets: "Headset Search",
            bodyArmor: "Body Armor Search",
            armoredRigs: "Armored Rig Search",
            unarmoredRigs: "Unarmored Rig Search",
            backpacks: "Backpack Search"
        },

        tooltipBarrel: {
            "Custom": "Benefits weapon customization only.",
            "CustomD+": "Benefits weapon customization only. (Weapon: Amplified bullet damage).",
            "CustomD-": "Benefits weapon customization only. (Weapon: Reduced bullet damage).",
            "FB": "Fixed barrel.",
            "FB D-": "Fixed barrel. (Weapon: Reduced bullet damage).",
            "FB D+": "Fixed barrel. (Weapon: Amplified bullet damage).",
            "FBNM": "Fixed barrel. (Weapon: No muzzle customization).",
            "FBNMD+": "Fixed barrel. (Weapon: No muzzle customization and Amplified bullet damage).",
            "FBNMD-": "Fixed barrel. (Weapon: No muzzle customization and Reduced bullet damage).",
            "R+": "Features a barrel that improves range only.",
            "R+ WD+": "Features a barrel that improves range only. (Weapon: Amplified bullet damage).",
            "R+ WD-": "Features a barrel that improves range only. (Weapon: Reduced bullet damage).",
            "D+": "Features a barrel that improves damage only.",
            "D+ R+": "Features a barrel that improves both damage and range.",
            "D+ R+ WD+": "Features a barrel that improves both damage and range. (Weapon: Amplified bullet damage).",
            "D+ R+ WD-": "Features a barrel that improves both damage and range. (Weapon: Reduced bullet damage).",
            "Default": "The default barrel offers the best ballistic performance.",
            "Default -": "The default barrel offers the best ballistic performance. (Weapon: Reduced bullet damage).",
            "Default +": "The default barrel offers the best ballistic performance. (Weapon: Amplified bullet damage)."
        },
        
        // =======================================================
        // --- NOVO: TEXTOS DA TELA DE LIMITES DE DANO (GRÁFICO) ---
        // =======================================================
        titleDamageChart: "Damage Limits by Range",
        lblDmgClass: "Class:",
        lblDmgWeapon: "Weapon:",
        lblDmgAmmo: "Ammo:",
        btnDmgAdd: "Add Chart and Table",
        btnDmgClear: "Clear Chart and Table",
        dmgCountSuffix: " Weapons remaining",
        dmgCountFull: "Limit Reached (5/5)",
        dmgSelectOption: "-- Select --",
        
        dmgTableHeaders: {
            combo: "Combo (Weapon + Ammo)",
            damage: "Damage (Ammo / Weapon)",
            range: "Range (Base / Max Effective)",
            efficiency: "Ballistic Efficiency",
            remove: "Remove"
        },
        
        dmgDynamicTexts: {
            // Dropdown Texts
            selectClass: "Select Class...",
            selectWeapon: "Select Weapon...",
            waitWeapon: "Waiting for Weapon...",
            selectAmmo: "Select Ammo...",
            slotAvailable: "AVAILABLE SLOT",

            // Badges
            badgeNoGain: "Neutral Barrel",
            badgeFixed: "Fixed Barrel",
            badgeMitigator: "Mitigating Barrel",
            badgeWepLoss: "Weapon w/ Loss",
            badgeCanoNoBuff: "Neutral Barrel",
            badgeWepGain: "Weapon w/ Gain",
            badgeCanoBuff: "Buffed Barrel",
            badgeStandard: "Standard Barrel",
            
            // Efficiency Terms
            effDamage: "% Damage",
            effRange: "m Range",
            effNeutralBadge: "NEUTRAL",

            // Tooltips: Weapon Damage
            tipWepLoss: "Weapon has lower damage than the ammo's base damage.",
            tipWepGain: "Weapon has higher damage than the ammo's base damage.",

            // Tooltips: Barrel Damage
            tipDanoDefault: "Barrel options are available, but none will improve the weapon's damage, and swapping barrels may worsen performance in other areas.",
            tipDanoNoBuff: "Barrel options are available, but none will improve damage.",
            tipDanoCustom: "Barrel options are available, but none will improve damage, though swapping the barrel may provide better customization benefits.",
            tipDanoFixed: "Damage cannot be improved due to the inability to swap the barrel.",
            tipDanoFixedNM: "Damage cannot be improved due to the inability to swap the barrel, and muzzle customization is not possible.",
            tipDanoMitigateEqual: "Features a barrel capable of mitigating the weapon's lower damage, matching the ammo's base damage.",
            tipDanoMitigateLoss: "Features a barrel capable of mitigating the weapon's lower damage, only reducing the loss of the ammo's damage.",
            tipDanoMitigateGain: "Features a barrel capable of mitigating the weapon's lower damage, improving it to exceed the ammo's base damage.",
            tipDanoDoubleBuff: "Has a barrel available to equip that further amplifies the weapon's damage.",
            tipDanoBuff: "Has a barrel available to equip that amplifies the weapon's damage.",

            // Tooltips: Barrel Range
            tipRangeDefault: "Barrel options are available, but none will improve range, and swapping the barrel may worsen range performance and other stats.",
            tipRangeFixed: "Range cannot be improved due to the inability to swap the barrel.",
            tipRangeCustom: "Barrel options are available, but none will improve range, though swapping the barrel may provide better customization benefits.",
            tipRangeBuff: "Has a barrel available to equip that amplifies the weapon's range.",
            tipRangeDPlus: "There are barrel options available, but none will improve the range. However, changing the barrel can give you the benefit of increasing the weapon's damage.",

            // Tooltips: Final Efficiency
            tipEffDmgPos: "The weapon shows a damage increase above the ammo's base damage.",
            tipEffDmgNeg: "The weapon shows a damage reduction, operating below the ammo's base damage.",
            tipEffRangePos: "The weapon shows a range gain above the weapon's base range without a barrel change.",
            tipEffRangeNeg: "The weapon shows a range reduction, operating below the weapon's base limit.",
            tipEffNeutral: "The weapon passes on the exact ammo damage and operates at its exact range limit, with no efficiency gains or penalties.",

            // Table Headers Tooltips
            tipHeaderDamage: "Shows the ammo's base damage on the left and the maximum damage the weapon can cause on the right.",
            tipHeaderRange: "Shows the weapon's base range on the left and, if available, the maximum range it achieves using a barrel modification on the right.",

            // Chart Instruction
            chartInstruction: "💡 Tip: Use the scroll wheel to Zoom the chart and click and drag to pan across the area.",

            // Generic Chart Texts
            fixedDefault: "Fixed/Default",
            default: "Default",
            na: "N/A",
            damageText: "Damage",
            rangeText: "Range",
            removeTooltip: "Remove weapon from chart",
            chartDistance: "Distance",
            chartType: "Type",
            chartTypeInitial: "Initial",
            chartTypeFinal: "Final",
            chartTypeSimulated: "Simulated Final",
            
            // Textos dos Eixos e Tabela (Nova Limpeza)
            axisDistance: "Distance (Meters)",
            axisDamage: "Total Damage",
            colRof: "Rate of Fire",
            tipRof: "Rounds per minute (RPM)"
        },

        dmgInfoModal: {
            title: "Data Methodology",
            tooltip: "Understand the data methodology",
            p1: "<b>1.</b> Damage and range data are based on weapon performance when equipped with the best available barrels for each of them.",
            p2: "<b>2.</b> The chart illustrates the damage drop-off based on data obtained in practical tests. Only the exact curve between the initial and final damage is not mapped, as this decay does not have a fixed pattern in the game and would make database maintenance difficult.",
            p3: "<b>3.</b> Internally, the game uses fractional distance measurements (e.g., 54.9 meters). Since the official shooting range values are rounded integers, the theoretical logic adopted by this tool considers each marked meter as a range (e.g., the 1-meter mark covers from 1.0m to 1.9m).",
            p4: "<b>4.</b> Initial and final damage values are absolute at the registered distances and do not change. Upon reaching the maximum registered range, the final damage value stabilizes and remains constant infinitely for subsequent meters.",
            btnClose: "Close"
        },

        // =======================================================
        // --- NOVO: TEXTOS DA TELA DO SIMULADOR BALÍSTICO ---
        // =======================================================
        navSimulator: "Ballistic Simulator:<br><span style='font-size: 0.85em; color: var(--text-dim); font-weight: normal;'>Weapon vs Armor</span>",
        titleSimulator: "Ballistic Simulator: Weapon vs Armor",
        lblSimAtkTitle: "Attack (Weapon & Ammo)",
        lblSimClass: "Weapon Class:",
        lblSimWeapon: "Weapon (Affects Base Damage):",
        lblSimAmmo: "Ammunition (Projectile):",
        lblSimDefTitle: "Defense (Armor)",
        lblSimRepWeaponTitle: "Weapon",
        lblSimRepAmmoTitle: "Ammo",
        lblSimRepArmorTitle: "Target Armor",
        lblSimArmorType: "Protection Category:",
        lblSimArmor: "Protection Item:",
        lblSimArmorClass: "Class:",
        lblSimArmorDur: "Maximum Durability:",
        simPlaceholderText: "Select Weapon, Ammo, and Armor to start the ballistic simulation.",
        lblSimReportTitle: "Penetration and Trauma Analysis",
        lblSimBarTitle: "PENETRATION CHANCE",
        
        // Status do Equipamento
        lblSimProjStatus: "Projectile Status",
        lblSimPierceLevel: "Pierce Level:",
        lblSimExactPen: "Penetration:",
        lblSimArmorDmg: "Armor Damage:",
        lblSimBaseDmg: "Base Damage (Weapon+Ammo):",
        lblSimBluntDmg: "Blunt Damage (Weapon+Ammo):",
        
        lblSimArmorStatus: "Armor Status",
        lblSimArmorClassLabel: "Armor Class:",
        lblSimArmorMaterialLabel: "Material:",
        lblSimArmorMaxDur: "Maximum Durability:",
        lblSimArmorCurDur: "Current Durability:",
        lblSimArmorAreas: "Protected Areas:",
        lblSimDurabilityState: "Armor Condition:",

        // Caixas de Dano
        lblSimDmgCloseTitle: "Initial Damage",
        lblSimResPenClose: "Penetration Damage",
        lblSimResArmorClose: "Shots to Critical Wear <span style=\"text-transform: none;\">(100% Penetration)</span>",
        lblSimResKillClose: "Shots to Kill",
        lblSimResAvgKill: "Average to Kill",

        lblSimDmgFarTitle: "Final Damage",
        lblSimResPenFar: "Penetration Damage",
        lblSimResArmorFar: "Shots to Critical Wear <span style=\"text-transform: none;\">(100% Penetration)</span>",
        lblSimResKillFar: "Shots to Kill",
        lblSimResAvgKill: "Average to Kill",

        lblSimWarnImp: "Important:",
        lblSimWarnTxt: "The calculation assumes that all buckshot pellets or flechettes hit the target.",
        
        simDynamicTexts: {
            fullPen: "FULL PENETRATION",
            partialPen: "PARTIAL PENETRATION",
            lowPen: "LOW PENETRATION",
            veryLowPen: "VERY LOW PENETRATION",
            noPen: "NO PENETRATION",
            descFull: "Pierce Level {0} beats Class {1} armor — every shot goes through.",
            descPartial: "Pierce Level {0} matches Class {1} armor — most shots pen with reduced damage.",
            descLow: "Pierce Level {0} is below Class {1} armor — penetration is unlikely and damage is reduced.",
            selectClass: "Select Class...",
            selectWeapon: "Select Weapon...",
            selectAmmo: "Select Ammo...",
            selectArmorCategory: "Select Category...",
            selectArmor: "Select Protection...",
            chest: "(Chest)",
            head: "(Head)",
            face: "(Face)",
            rangeClose: "Range: 0m to {0}m",
            rangeFar: "Final Range: {0}m+",
            initial: "(Initial)",
            final: "(Final)",
            optHelmets: "Helmets",
            optMasks: "Masks",
            optBodyArmor: "Body Armor",
            optRigs: "Armored Rigs",
            optAll: "Body Armor and Armored Rigs"
        },

        simInfoModal: {
            title: "Simulator Methodology",
            tooltip: "Understand the calculation methodology",
            p1: "<b>1.</b> Damage and range data are based on weapon performance when equipped with the best available barrels for each model.",
            p2: "<b>2.</b> The results shown are purely calculated, not manually collected. This was done to prevent difficulties in maintaining the database.",
            p3: "<b>3.</b> Due to the high mathematical proportion, it is difficult to avoid margins of error when the difference between armor and ammo exceeds 3 levels. At this point, my calibration comes into play. The adjustment does not eliminate game variables, but anchors the results close to reality, keeping the error between perfect hits or variations of at most ±3 to ±4 shots.",
            btnClose: "Close"
        },

        simArmorAreasMap: {
            "Chest": "Chest",
            "Upper Abdomen": "Upper Abdomen",
            "Lower Abdomen": "Lower Abdomen",
            "Shoulder": "Shoulder",
            "Head": "Head",
            "Ears": "Ears",
            "Face": "Face"
        },

        // ==========================================
        // TEXTOS DAS TABELAS DE BUSCA (COLUNAS E CRITÉRIOS)
        // ==========================================
        views: {
            weapons: {
                criteria: ["Alphabetical", "Vertical Recoil Control", "Horizontal Recoil Control", "Ergonomics", "Weapon Stability", "Accuracy", "Hip-fire stability", "Effective Range", "Muzzle Velocity", "Fire Mode", "Rate of Fire", "Firepower", "Barrel Upgrade (Weapon Profile)"],
                cols: {
                    name: "Name", nameTip: "The name of the weapon.",
                    cls: "Class", clsTip: "Weapon category.",
                    cal: "Caliber", calTip: "The type of ammunition used.",
                    vrc: "VRC", vrcTip: "Vertical recoil control.",
                    hrc: "HRC", hrcTip: "Horizontal recoil control.",
                    ergo: "Ergo", ergoTip: "Weapon ergonomics.",
                    ads: "ADS.Stab", adsTip: "Weapon stability (ADS).",
                    acc: "Acc", accTip: "Base accuracy.",
                    hip: "Hip.Stab", hipTip: "Hip-fire stability.",
                    range: "Range(m)", rangeTip: "Effective range.",
                    muz: "Muz.Vel", muzTip: "Muzzle Velocity.",
                    fire: "Fire Mode", fireTip: "Available fire modes.",
                    rof: "RoF", rofTip: "Rate of Fire.",
                    power: "Firepower", powerTip: "Estimated firepower.",
                    barrel: "Barrel Upgrade (Weapon Profile)", barrelTip: "Barrel upgrade options and weapon profile."
                }
            },
            ammo: {
                criteria: ["Alphabetical", "Penetration Level", "Penetration", "Base Damage", "Armor Damage", "Blunt Trauma", "Muzzle Velocity", "Accuracy", "Vertical Recoil Control", "Horizontal Recoil Control", "Wound Chance"],
                cols: {
                    name: "Name", nameTip: "The name of the ammunition.",
                    lv: "Lv", lvTip: "Penetration level (Tier).",
                    pen: "Pen", penTip: "Penetration.",
                    dmg: "Base Dmg", dmgTip: "Ammunition damage.",
                    armDmg: "Armor Dmg", armDmgTip: "The ammunition's efficiency in reducing enemy armor durability.",
                    blunt: "Blunt Tr.", bluntTip: "Blunt trauma level.",
                    vel: "Vel(m/s)", velTip: "Projectile velocity.",
                    acc: "Acc", accTip: "Accuracy.",
                    vrc: "VRC", vrcTip: "Vertical recoil control.",
                    hrc: "HRC", hrcTip: "Horizontal recoil control.",
                    wound: "Wound Chance", woundTip: "Chance to cause a wound.",
                    cal: "Caliber", calTip: "Ammunition caliber."
                }
            },
            grenades: {
                criteria: ["Alphabetical", "Explosion Delay", "Range", "Armor Damage", "Penetration", "Fragments", "Frag Type", "Effect Time"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    delay: "Explosion Delay", delayTip: "The minimum and maximum time in seconds for detonation.",
                    range: "Range", rangeTip: "Effective explosion range.",
                    armDmg: "Armor Dmg", armDmgTip: "Armor damage potential.",
                    pen: "Penetration", penTip: "Armor penetration capability.",
                    frags: "Fragments", fragsTip: "Amount of fragments.",
                    fragType: "Frag Type", fragTypeTip: "Fragment material type.",
                    time: "Effect Time", timeTip: "The duration in seconds of continuous effects (smoke, gas, fire)."
                }
            },
            helmets: {
                // criteria: ["Alphabetical", "Weight", "Durability", "Armor Class", "Sound Block", "Movement Speed", "Ergonomics", "Protected Area", "Ricochet Chance", "Sound Pickup", "Noise Reduction", "Accessory", "Max Mask Class"],
                criteria: ["Alphabetical", "Weight", "Durability", "Armor Class", "Sound Block", "Movement Speed", "Ergonomics", "Protected Area", "Sound Pickup", "Noise Reduction", "Accessory", "Max Mask Class"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Helmet weight.",
                    dur: "Dur.", durTip: "Total durability points.",
                    cls: "Cl", clsTip: "Armor class.",
                    mat: "Material", matTip: "Main manufacturing material.",
                    block: "Sound Block", blockTip: "The level of sound blocking caused by the helmet.",
                    mov: "Mov.Spd", movTip: "The movement speed penalty percentage.",
                    ergo: "Ergo", ergoTip: "Ergonomics penalty.",
                    area: "Prot. Area", areaTip: "The parts of the head that the helmet protects.",
                    rico: "Ricochet", ricoTip: "The chance of a projectile ricocheting off the helmet.",
                    pickup: "S.Pickup", pickupTip: "The power of the built-in headset to pick up ambient sounds.",
                    noise: "N.Red", noiseTip: "The power of the built-in headset to reduce loud noises.",
                    acc: "Accessory", accTip: "Mask or tactical accessory compatibility.",
                    maxMask: "Max Mask Cl", maxMaskTip: "Shows the maximum Class of the compatible mask."
                }
            },
            masks: {
                // criteria: ["Alphabetical", "Weight", "Durability", "Armor Class", "Ricochet Chance"],
                criteria: ["Alphabetical", "Weight", "Durability", "Armor Class"],
                cols: {
                    name: "Name", nameTip: "The name of the mask.",
                    weight: "Weight", weightTip: "Item weight.",
                    dur: "Dur.", durTip: "Total durability points.",
                    cls: "Cl", clsTip: "Armor class.",
                    mat: "Material", matTip: "Main material.",
                    rico: "Ricochet Chance", ricoTip: "Chance of a projectile ricocheting."
                }
            },
            gasMasks: {
                criteria: ["Alphabetical", "Weight", "Durability", "Anti-Poison", "Anti-Flash"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Mask weight.",
                    dur: "Dur.", durTip: "Total durability points.",
                    poison: "Anti-Poison", poisonTip: "Protection level against poisonous gas.",
                    flash: "Anti-Flash", flashTip: "Protection level against flashbangs."
                }
            },
            headsets: {
                criteria: ["Alphabetical", "Weight", "Sound Pickup", "Noise Reduction"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Headset weight.",
                    pickup: "Sound Pickup", pickupTip: "The power of the built-in headset to pick up ambient sounds.",
                    noise: "Noise Reduction", noiseTip: "The power of the built-in headset to reduce loud noises."
                }
            },
            bodyArmor: {
                criteria: ["Alphabetical", "Weight", "Armor Class", "Durability", "Material", "Movement Speed", "Ergonomics", "Protected Area"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Armor weight.",
                    cls: "Cl", clsTip: "Armor class.",
                    dur: "Dur.", durTip: "Total durability points.",
                    mat: "Material", matTip: "Main material.",
                    mov: "Mov.Spd", movTip: "Movement speed penalty.",
                    ergo: "Ergo", ergoTip: "Ergonomics penalty.",
                    area: "Prot. Area", areaTip: "Protected body areas."
                }
            },
            armoredRigs: {
                criteria: ["Alphabetical", "Weight", "Armor Class", "Durability", "Movement Speed", "Ergonomics", "Storage Space", "Protected Area", "Block set (HxV)"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Armor weight.",
                    cls: "Cl", clsTip: "Armor class.",
                    dur: "Dur.", durTip: "Durability points.",
                    mat: "Material", matTip: "Manufacturing material.",
                    mov: "Mov.Spd", movTip: "The movement speed penalty percentage.",
                    ergo: "Ergo", ergoTip: "Ergonomics penalty.",
                    space: "Space", spaceTip: "The amount of storage slots the rig offers.",
                    area: "Prot. Area", areaTip: "Protected body areas.",
                    layout: "Block set (HxV)", layoutTip: "The layout and size of the internal slots (Format: Horizontal x Vertical)"
                }
            },
            unarmoredRigs: {
                criteria: ["Alphabetical", "Weight", "Storage Space", "Block set (HxV)", "+Stor -Space"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Item weight.",
                    space: "Space", spaceTip: "The amount of storage slots the rig offers.",
                    unfold: "Unfolded", unfoldTip: "The space the item occupies in the inventory in 'Horizontal x Vertical' format.",
                    fold: "Folded", foldTip: "The space the item occupies when folded, also in 'HxV' format.",
                    layout: "Block set (HxV)", layoutTip: "The layout and size of the internal pockets/compartments.",
                    eff: "+Stor -Space", effTip: "Storage balance: shows if the item creates more space than it consumes in the inventory."
                }
            },
            backpacks: {
                criteria: ["Alphabetical", "Weight", "Storage Space", "Block set (HxV)", "+Stor -Space"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    weight: "Weight", weightTip: "Item weight.",
                    space: "Space", spaceTip: "The amount of storage slots the backpack offers.",
                    unfold: "Unfolded", unfoldTip: "The space the item occupies in the inventory in 'Horizontal x Vertical' format.",
                    fold: "Folded", foldTip: "The space the item occupies when folded, also in 'HxV' format.",
                    layout: "Block set (HxV)", layoutTip: "The layout and size of the internal pockets/compartments.",
                    eff: "+Stor -Space", effTip: "Storage balance: shows if the item creates more space than it consumes in the inventory."
                }
            },
            painkillers: {
                criteria: ["Uses", "Duration", "Dehydration", "Max Duration"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    uses: "Uses", usesTip: "Amount of times the item can be used.",
                    dur: "Duration", durTip: "Effect time in seconds for a single use.",
                    dehyd: "Dehydration", dehydTip: "Hydration points lost per use.",
                    delay: "Delay", delayTip: "Time in seconds to consume the item.",
                    maxDur: "Max Dur.", maxDurTip: "Maximum coverage time generated by spending 100% of the painkiller's charges.",
                    maxDehyd: "Max Dehyd.", maxDehydTip: "Total hydration loss if you consume all uses of the painkiller."
                }
            },
            bandages: {
                criteria: ["Standard"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    uses: "Uses", usesTip: "Amount of times the item can be used.",
                    delay: "Delay", delayTip: "Time in seconds to apply the item.",
                    cost: "Durab. Cost", costTip: "Durability points spent per use."
                }
            },
            surgical: {
                criteria: ["Uses", "Delay", "Dehydration", "HP Recovery", "Space (HxV)"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    uses: "Uses", usesTip: "Amount of times the item can be used.",
                    delay: "Delay", delayTip: "Time in seconds to apply the item.",
                    dehyd: "Dehydration", dehydTip: "Hydration points lost when using the item.",
                    hp: "HP Rec.", hpTip: "Health points (HP) recovered per use.",
                    cost: "Dur. Cost", costTip: "Durability points spent per use.",
                    space: "Space (HxV)", spaceTip: "The space the item occupies in 'Horizontal x Vertical' format."
                }
            },
            nebulizers: {
                criteria: ["Standard"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    uses: "Uses", usesTip: "Amount of times the item can be used.",
                    delay: "Delay", delayTip: "Time in seconds to apply the item.",
                    cost: "Durab. Cost", costTip: "Durability points spent per use."
                }
            },
            medkits: {
                criteria: ["Durability", "Dehydration", "Healing Speed", "Delay", "Space (HxV)", "Durability per Slot"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    dur: "Durability", durTip: "Total durability of the kit.",
                    dehyd: "Dehydration", dehydTip: "Hydration points lost when using the kit.",
                    speed: "Heal Spd", speedTip: "Speed at which the kit heals wounds.",
                    delay: "Delay", delayTip: "Time in seconds to apply the item.",
                    cost: "Dur. Cost", costTip: "Durability points spent per use.",
                    space: "Space (HxV)", spaceTip: "The space the item occupies in 'Horizontal x Vertical' format.",
                    eff: "Durab/Slot", effTip: "Cost-benefit of DURABILITY PER SLOT."
                }
            },
            stimulants: {
                criteria: ["Standard"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    effect: "Main Effect", effectTip: "The main bonus provided by the stimulant.",
                    dur: "Duration", durTip: "Effect time in seconds.",
                    dehyd: "Dehydration", dehydTip: "Hydration points lost when using the item.",
                    energy: "Energy Red.", energyTip: "Energy points lost when using the item.",
                    delay: "Delay", delayTip: "Time in seconds to apply the item."
                }
            },
            food: {
                criteria: ["Alphabetical", "Hydration", "Energy", "Hydration per Slot", "Energy per Slot"],
                cols: {
                    name: "Name", nameTip: "The name of the item.",
                    hyd: "Hydration", hydTip: "Amount of hydration the item recovers or deducts.",
                    eng: "Energy", engTip: "Energy points the item recovers or deducts.",
                    stam: "Stamina Rec.", stamTip: "Stamina recovery level (breath).",
                    space: "Space (HxV)", spaceTip: "The space the item occupies in 'Horizontal x Vertical' format.",
                    hydSlot: "Hydrat.Slot", hydSlotTip: "Cost-benefit of HYDRATION PER SLOT.",
                    engSlot: "Energy.Slot", engSlotTip: "Cost-benefit of ENERGY PER SLOT.",
                    delay: "Delay", delayTip: "Time in seconds to fully consume the item."
                }
            }
        },

        titleMaskComp: "Compatibility: Masks x Helmets",
        maskCompHeaders: {
            mask: "Mask",
            helmets: "Compatible Helmets"
        },
        
        maskFilterModal: {
            title: "Unified Class Filter",
            desc: "Check the classes you want to <b>HIDE</b> (affects masks and helmets simultaneously).",
            columnTitle: "Classes Found",
            btnClean: "Clear",
            btnApply: "Apply",
            btnCancel: "Cancel"
        },
        filterModals: {
            titleWeapons: "Hide Weapons - Check what you want to HIDE",
            titleAmmo: "Ammo Filters - Check what you want to HIDE",
            titleHelmets: "Helmet Filters - Check what you want to HIDE",
            titleArmor: "Armor Filters - Check what you want to HIDE",
            titleRigs: "Armored Rig Filters - Check what you want to HIDE",
            colCategory: "Category",
            colCaliber: "Caliber",
            colFireMode: "Fire Mode",
            colFirepower: "Firepower",
            colBarrel: "Barrel Upgrade (Weapon Profile)",
            colLevels: "Levels (Lv)",
            colWound: "Wound Chance",
            colClassCl: "Class (Cl)",
            colSoundBlock: "Sound Block",
            colArea: "Protected Area",
            colRico: "Ricochet",
            colAccessory: "Accessory",
            colMaxMask: "Max Mask Class",
            colArmorClass: "Armor Class"
        }
    }
};

function traduzirDado(categoria, chave, valorIngles, lang = currentLang) {
    if (!valorIngles || valorIngles === "/////" || lang === 'en') return valorIngles;

    // A MÁGICA: Ele entra direto no idioma atual e procura o dataDict dele
    const banco = translations[lang] ? translations[lang].dataDict : null;

    if (banco && banco[categoria] && banco[categoria][chave]) {
        const traducao = banco[categoria][chave][valorIngles];
        if (traducao) return traducao;
    }
    
    return valorIngles;
}