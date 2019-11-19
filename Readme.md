# ![](https://raw.githubusercontent.com/Vylda/Hit-tracker/master/icons/logs-48.png) Hit tracker for Firefox

![](https://raw.githubusercontent.com/Vylda/Hit-tracker/master/resources/screenshot.png)



## Použití

Hit tracker je nástroj určený pro snazší zobrazení požadavků na logování Seznam.cz (https://h.imedia.cz/hit). Po nainstalovávání do Firefoxu se objeví nový panel Hit tracker ve Vývojářských nástrojích (otevřou se pomocí klávesy F12).

Po otevření se začnou vypisovat všechna zachycená dat.

Po kliknutí na políčko ve sloupci Parameter value se data zobrazí jako objekt v konzoli Vývojářských nástrojů.

V pravém dolním rohu jsou dvě tlačítka:

* <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/Vylda/Hit-tracker/master/resources/filter.png"> **Filtr** -  otevře skryje okno filtru;
* <img style="vertical-align: middle;" src="https://raw.githubusercontent.com/Vylda/Hit-tracker/master/resources/clear.png"> **Clear** - smaže všechna data z tabulky.

### Filtr

![](https://raw.githubusercontent.com/Vylda/Hit-tracker/master/resources/filterdata.png)

V okně filtru můžete zadat do políčka text, při jehož  výskytu v datech se zobrazí odesílaná data.

Zaškrtnutím políčka **RegExp** je text v políčku brán jako regulární výraz ([Psaní regulárních výrazů na MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Writing_a_regular_expression_pattern), není třeba psát úvodní a koncové lomítko). Např. při zatrženém políčku *RegExp* a hledaném textu *"text":"[a-žA-Ž0-9]* +[a-žA-Ž0-9 ]+"*, budou zobrazena pouze data, kde je v atributu *text* víceslovná hodnota.

Pokud zaškrtnete políčko **aA**, bude vyhledávání citlivé na velikost písmen.

Nastavení fitru reflektují pouze nově poslaná data.

## Chrome

Pokud používáte prohlížeč Chrome, použijte [Hit tracker for Chrome](https://github.com/Vylda/Hit-tracker-chrome).

## Aktuální verze a download

### 1.2
[download](https://raw.githubusercontent.com/Vylda/Hit-tracker/1.2/package/hit_tracker-1.2-fx.xpi)
#### Changelog
* filtrování

### 1.1
[download](https://raw.githubusercontent.com/Vylda/Hit-tracker/1.1/package/hit_tracker-1.1-fx.xpi)
#### Changelog
* drobné změny ve vzhledu (plovoucí hlavička)
* lepší zobrazení hodnot typu Opbjekt a Array

### 1.0
[download](https://raw.githubusercontent.com/Vylda/Hit-tracker/1.0/package/hit_tracker-1.0-fx.xpi)
#### Changelog
* první stabilní verze
