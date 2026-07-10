#ifndef TYPEMOUVEMENT_HPP
#define TYPEMOUVEMENT_HPP

#include <string>

enum class TypeMouvement {
    ENTREE,
    SORTIE,
    AJUSTEMENT
};

inline std::string typeMouvementToString(TypeMouvement type) {
    switch(type) {
        case TypeMouvement::ENTREE: return "ENTREE";
        case TypeMouvement::SORTIE: return "SORTIE";
        case TypeMouvement::AJUSTEMENT: return "AJUSTEMENT";
        default: return "INCONNU";
    }
}

#endif