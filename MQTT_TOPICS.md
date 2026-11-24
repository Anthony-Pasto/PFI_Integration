# Topics MQTT pour l'application PFI

Les topics actuels suivent le format utilisé par le serveur Node.js :

```text
États :     RAM/<MODULE>/ETATS/<CAPTEUR>
Commandes : RAM/<MODULE>/CMD/<CAPTEUR>
Alarmes :   RAM/<MODULE>/ETATS/<ALARME>
ACK alarme: RAM/ALARMES/ETAT/<ALARME>
```

Pour remplir le code C++, les constantes peuvent être définies ainsi.

```cpp
// Consigne et mesures du panneau
static const std::string TOPIC_CONSIGNE_GROS = "RAM/PANNEAU/CMD/ConsTmpGB";
static const std::string TOPIC_NIVEAU_GROS = "RAM/PANNEAU/ETATS/NivGB";
static const std::string TOPIC_NIVEAU_PETIT = "RAM/PANNEAU/ETATS/NivPB";
static const std::string TOPIC_TEMP_GROS = "RAM/PANNEAU/ETATS/TmpGB";
static const std::string TOPIC_TEMP_PETIT = "RAM/PANNEAU/ETATS/TmpPB";

// Ouvertures des vannes
static const std::string TOPIC_VALVE_LARGE = "RAM/PANNEAU/ETATS/ValveGB";
static const std::string TOPIC_VALVE_HOT = "RAM/PANNEAU/ETATS/ValveEC";
static const std::string TOPIC_VALVE_SMALL = "RAM/PANNEAU/ETATS/ValvePB";
static const std::string TOPIC_VALVE_COLD = "RAM/PANNEAU/ETATS/ValveEF";

// État de la pompe
static const std::string TOPIC_POMPE = "RAM/PANNEAU/ETATS/Pompe";

// Alarmes de débordement
static const std::string TOPIC_DEBORDEMENT_GROS = "RAM/ALARMES/ETATS/ALR_GB_OVF";
static const std::string TOPIC_DEBORDEMENT_PETIT = "RAM/ALARMES/ETATS/ALR_PB_OVF";

// Courants disponibles dans l'interface Power Meter
static const std::string TOPIC_COURANT[8] = {
    "RAM/POWERMETER/ETATS/Ia",
    "RAM/POWERMETER/ETATS/Ib",
    "", "", "", "", "", ""
};
```

## Topics de commande associés

Les capteurs suivants peuvent recevoir une commande avec `RAM/<MODULE>/CMD/<CAPTEUR>`.

```cpp
static const std::string CMD_MODE = "RAM/PANNEAU/CMD/Mode";
static const std::string CMD_NIVEAU_GROS = "RAM/PANNEAU/CMD/NivGB";
static const std::string CMD_NIVEAU_PETIT = "RAM/PANNEAU/CMD/NivPB";
static const std::string CMD_TEMP_PETIT = "RAM/PANNEAU/CMD/ConsTmpPB";
static const std::string CMD_VALVE_GRAND_BASSIN = "RAM/PANNEAU/CMD/ValveGB";
static const std::string CMD_VALVE_PETIT_BASSIN = "RAM/PANNEAU/CMD/ValvePB";
static const std::string CMD_VALVE_EAU_CHAUDE = "RAM/PANNEAU/CMD/ValveEC";
static const std::string CMD_VALVE_EAU_FROIDE = "RAM/PANNEAU/CMD/ValveEF";
static const std::string CMD_POMPE = "RAM/PANNEAU/CMD/Pompe";
```

Les commandes ON/OFF utilisent `ON` ou `OFF`. Les valeurs numériques des vannes et niveaux vont de `0` à `100`.

## Acquittement des alarmes

```cpp
static const std::string ACK_ALR_GB_OVF = "RAM/ALARMES/ETAT/ALR_GB_OVF";
static const std::string ACK_ALR_PB_OVF = "RAM/ALARMES/ETAT/ALR_PB_OVF";
static const std::string ACK_ALR_GB_NIV_MAX = "RAM/ALARMES/ETAT/ALR_GB_NIV_MAX";
static const std::string ACK_ALR_PB_NIV_MAX = "RAM/ALARMES/ETAT/ALR_PB_NIV_MAX";
static const std::string ACK_ALR_CNX_BAL = "RAM/ALARMES/ETAT/ALR_CNX_BAL";
static const std::string ACK_ALR_CNX_POW = "RAM/ALARMES/ETAT/ALR_CNX_POW";
```

La valeur MQTT envoyée pour un acquittement est `ACK`.

## Capteurs complémentaires

```cpp
"RAM/POWERMETER/ETATS/Van"
"RAM/POWERMETER/ETATS/Vbn"
"RAM/POWERMETER/ETATS/Vab"
"RAM/POWERMETER/ETATS/Ia"
"RAM/POWERMETER/ETATS/Ib"
"RAM/POWERMETER/ETATS/KW"
"RAM/POWERMETER/ETATS/KWh"
"RAM/POWERMETER/ETATS/FP"
```

> Important : `TmpGB` et `ConsTmpGB` ne sont pas encore présents dans les pages de l'application actuelle. Ils doivent être confirmés avec le matériel ou ajoutés dans les publications MQTT du processus. Le topic `TOPIC_CONSIGNE_GROS` doit pointer vers le même nom de capteur que celui publié par l'autre programme.