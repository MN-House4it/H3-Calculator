import { makeAutoObservable, runInAction } from 'mobx';
import { localStorageService } from '../services/CalculatorStorage';
import Toast from 'react-native-toast-message';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Calculator } from '../models/Calculator';


class CalculatorViewModel {
  calculator: Calculator | null = null;
  calculators: Calculator[] = [];
  selectValue = '';
  calculatorId: string;

  constructor(calculatorId: string) {
    makeAutoObservable(this);
    this.calculatorId = calculatorId;
  }

  fetchCalculator = async () => {
    const storedCalculator = await localStorageService.getCalculatorById(this.calculatorId);
    runInAction(() => {
      this.calculator = storedCalculator;
    });
    await this.fetchCalculators();
  };

  fetchCalculators = async () => {
    const storedCalculators = await localStorageService.getCalculators();
    runInAction(() => {
      this.calculators = storedCalculators || [];
    });
  };

  renderPickerItems = () => {
    return this.calculators.filter((c) => c.id !== this.calculator?.id);
  };

  insertOtherCalculatorValue = async (item: { lastResult: any }) => {
    runInAction(() => {
      this.calculator = {
        ...this.calculator,
        lastTyped: this.calculator?.lastTyped === '0' ? item.lastResult : this.calculator?.lastTyped + item.lastResult,
      };
    });
    if (this.calculator) {
      await localStorageService.updateCalculator(this.calculatorId, this.calculator);
    } else {
      console.warn("Calculator is null, cannot update.");
    }
      };

  isLastCharacterOperator(input: string): boolean {
    const lastChar = input.trim().slice(-1);
    return ['+', '-', '×', '÷'].includes(lastChar);
  }

  checkCalculation(calculation: string): boolean {
    if (this.isLastCharacterOperator(calculation)){
      return true;
    }
    calculation = calculation.trim();
    const match = calculation.match(/([\d.,]+)(?=[^\d.,]|$)/g);

    if (match) {
      const lastNumber = match[match.length - 1];
      return !lastNumber.includes('.');
    }

    return false;
  }

  handleTap = async (type: string, value: string | null) => {
    //let updatedCalculator = { ...this.calculator };

    runInAction(() => {
      if (this.calculator) {
        if (type === 'equal' && this.calculator?.lastTyped) {
          const result = this.calculateExpression(this.calculator?.lastTyped);
          if (!isNaN(result)) {
            //updatedCalculator = {
            //  ...updatedCalculator,
            //  lastResult: result.toString(),
            //  lastOperation: updatedCalculator?.lastTyped,
            //  lastTyped: result.toString(),
            //};
            this.calculator.lastResult = result.toString();
            this.calculator.lastOperation = this.calculator?.lastTyped;
            this.calculator.lastTyped = result.toString();

            if (result === 69 || result === 80085) {
              Toast.show({
                type: 'info',
                text1: 'Nice!',
              });
            }
          }      
        } else if (type === 'clear') {
          //updatedCalculator = { ...updatedCalculator, lastResult: '0', lastOperation: '', lastTyped: '0' };
          //this.calculator = updatedCalculator;
          this.calculator.lastResult = '0';
          this.calculator.lastOperation = '';
          this.calculator.lastTyped = '0';
        } else if (type === 'delete') {
          //updatedCalculator = { ...updatedCalculator, lastTyped: updatedCalculator?.lastTyped.slice(0, -1) || '0' };
          //this.calculator = updatedCalculator;
          if (this.calculator) {
            this.calculator.lastTyped = (this.calculator.lastTyped?.slice(0, -1)) || '0';
          }
        } else if (this.calculator.lastTyped && this.calculator.lastTyped.length < 50) {
          if (type === 'operator') {
            let lastTyped = this.calculator?.lastTyped;
            if (this.isLastCharacterOperator(lastTyped)) {
              lastTyped = lastTyped.slice(0, -1);
            }
            //updatedCalculator = { ...updatedCalculator, lastTyped: lastTyped + value };
            //this.calculator = updatedCalculator;
            this.calculator.lastTyped = lastTyped + value;
          } else if (type !== 'comma' || this.checkCalculation(this.calculator?.lastTyped)) {
            if (type === 'comma' && this.isLastCharacterOperator(this.calculator?.lastTyped)){
              this.calculator.lastTyped = this.calculator?.lastTyped + '0';
            }
            //updatedCalculator = {
            //  ...updatedCalculator,
            //  lastTyped: updatedCalculator?.lastTyped === '0' && type !== 'comma' ? value : updatedCalculator?.lastTyped + value,
            //};
            //this.calculator = updatedCalculator;

            this.calculator.lastTyped = this.calculator.lastTyped === '0' && type !== 'comma' ? value?.toString() : this.calculator?.lastTyped + value;
          }
        }

      } else {
        // Handle the case when lastTyped is undefined
        console.warn('lastTyped is undefined');
      }




      
    });

    if (this.calculator){
      await localStorageService.updateCalculator(this.calculatorId, this.calculator);
    }

  };

  calculateExpression = (expression: string) => {
    try {
      const sanitizedExpression = expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/[^-()\d/*+.]/g, '');
      return eval(sanitizedExpression);
    } catch (error) {
      console.error('Invalid expression:', error);
      Toast.show({
        type: 'error',
        text1: 'Invalid Expression',
        text2: 'Please check your input',
      });
      return NaN;
    }
  };



  buttons = [
    [
      { title: 'C', type: 'clear', value: null, isHighlighted: true, highlightColor: '#808080' },
      { title: '(', type: 'number', value: '(', isHighlighted: true, highlightColor: '#808080' },
      { title: ')', type: 'number', value: ')', isHighlighted: true, highlightColor: '#808080'},
      { title: '÷', type: 'operator', value: '÷', isHighlighted: true, highlightColor: '#2196f3' },
    ],
    [
      { title: '7', type: 'number', value: '7' },
      { title: '8', type: 'number', value: '8' },
      { title: '9', type: 'number', value: '9' },
      { title: '×', type: 'operator', value: '×', isHighlighted: true, highlightColor: '#2196f3' },
    ],
    [
      { title: '4', type: 'number', value: '4' },
      { title: '5', type: 'number', value: '5' },
      { title: '6', type: 'number', value: '6' },
      { title: '-', type: 'operator', value: '-', isHighlighted: true, highlightColor: '#2196f3' },
    ],
    [
      { title: '1', type: 'number', value: '1' },
      { title: '2', type: 'number', value: '2' },
      { title: '3', type: 'number', value: '3' },
      { title: '+', type: 'operator', value: '+', isHighlighted: true, highlightColor: '#2196f3' },
    ],
    [
      { title: '←', type: 'delete', value: null },
      { title: '0', type: 'number', value: '0' },
      { title: '.', type: 'comma', value: '.' },
      { title: '=', type: 'equal', value: null, isHighlighted: true, highlightColor: '#2196f3' },
    ],
  ];
  
}

export default CalculatorViewModel;
