#ifndef RAPPORTSERVICE_HPP
#define RAPPORTSERVICE_HPP

#include "../service/StockService.hpp"
#include <string>

class RapportService {
private:
    const StockService& stockService;

public:
    RapportService(const StockService& service);
    
    void genererRapportComplet() const;
    void afficherStockInsuffisant() const;
    void afficherValeurStock() const;
    void afficherMouvementsRecents(int n = 10) const;
    void afficherStatistiques() const;
    
    double calculerValeurStock() const;
    int getNombreProduits() const;
    int getNombreMouvements() const;
};

#endif