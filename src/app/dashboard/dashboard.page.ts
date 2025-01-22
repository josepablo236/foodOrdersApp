import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiService } from '../services/api.service';
import { Product } from '../interfaces/Product';
import { Order } from '../interfaces/Order';
import { Category } from '../interfaces/Category';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  grafico: any;
  productSales: { name: string; quantity: number }[] = []; //Productos mas vendidos
  categorySales: { category: string; quantity: number }[] = []; //categorias mas vendidas
  totalSales: number = 0; //Total de ventas
  totalProfit: number = 0; //Total de ganancia
  top3Products: { name: string; quantity: number }[] = [];
  topClients: { client: string; total: number }[] = []; //Clientes con más ventas
  salesByMonth: { month: string; total: number }[] = []; //Ventas por mes
  weeklySales = [0, 0, 0, 0, 0, 0, 0]; // Array para cada día de la semana
  paymentMethods = [{method: '', value: 0}];

  categoryChart: Chart | null = null;
  weeklyTrendChart: Chart | null = null;
  monthlySalesChart: Chart | null = null;
  paymentMethodChart: Chart | null = null;
  topProductsChart: Chart | null = null;
  categories : Array<Category> = [
      { id: 1, name: 'Palicrepas Dulces',  icon: 'assets/img/Dulces.png'},
      { id: 2, name: 'Palicrepas Saladas', icon: 'assets/img/Salchicha.png'},
      { id: 3, name: 'Bebidas', icon:  'assets/img/Bebidas.png'},
      { id: 4, name: 'Toppings', icon: 'assets/img/Toppings.png'},
      { id: 5, name: 'Combos', icon: 'assets/img/CombosBebida.png'},
    ];


  constructor(private apiService : ApiService) {}

  ionViewWillEnter(){
    this.loadData();
  }

  loadData() {
    const orders = this.apiService.getOrders();
    this.clean();
    this.calculateStatistics(orders);
    this.initCharts();
  }

  clean(){
    this.categorySales = [];
    this.productSales = [];
    this.totalProfit = 0;
    this.totalSales = 0;
    this.topClients = [];
    this.weeklySales = [0, 0, 0, 0, 0, 0, 0];
    this.salesByMonth = Array(12).fill({ total: 0, month: '' });
    this.paymentMethods = [];
    this.top3Products = [];
  }

  handleRefresh(event : any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadData();
      event.target.complete();
    }, 2000);
  }

  calculateStatistics(orders: any[]) {
    let productMap = new Map<string, number>();
    let categoryMap = new Map<number, number>();
    let clientMap = new Map<string, number>();
    let monthMap = new Map<string, number>();
    let cashCount = 0;
    let cardCount = 0;

    orders.forEach((order : Order) => {
      // Total ventas y ganancia
      this.totalSales += order.total;
      // this.totalProfit += order.items.reduce((sum, item) => {
      //   return sum + (item.product.price - item.product.cost) * item.quantity;
      // }, 0);

      // Ventas por producto
      order.items.forEach((item) => {
        productMap.set(
          item.product.name,
          (productMap.get(item.product.name) || 0) + item.quantity
        );

        // Ventas por categoría
        categoryMap.set(
          item.product.categoryId,
          (categoryMap.get(item.product.categoryId) || 0) + item.quantity
        );
      });

      // Ventas por cliente
      if(order.customer != undefined){
        clientMap.set(
          order.customer,
          (clientMap.get(order.customer) || 0) + order.total
        );
      }

      //Contadores de metodo de pago
      order.paymentMethod === 'efectivo' ? cashCount++ : cardCount++;

      // Ventas por mes
      const month = new Date(order.date).toLocaleString('default', {
        month: 'long',
      });
      monthMap.set(month, (monthMap.get(month) || 0) + order.total);

      //Tendencia por semana
      const dayIndex = new Date(order.date).getDay(); // 0 = Domingo, 1 = Lunes, ...
      this.weeklySales[dayIndex] += order.total; // Sumar el total de la orden al día correspondiente
    });

    // Reorganizar para que comience en lunes (mover domingo al final)
    this.weeklySales = [...this.weeklySales.slice(1), this.weeklySales[0]];

    // Convertir Map a Array
    this.productSales = Array.from(productMap, ([name, quantity]) => ({
      name,
      quantity,
    }));

    //Convertir arreglo de categorias
    this.categorySales = Array.from(categoryMap, ([categoryId, quantity]) => {
    const category = this.categories.find(cat => cat.id === categoryId);
    return {
      category: category ? category.name : 'Desconocido', // Usa el nombre o 'Desconocido' si no se encuentra
      quantity,
    };
  });
    this.topClients = Array.from(clientMap, ([client, total]) => ({
      client,
      total,
    }));
    this.salesByMonth = Array.from(monthMap, ([month, total]) => ({
      month,
      total,
    }));

    // Ordenar y filtrar los top 3 y top 5
    this.top3Products = [...this.productSales]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    this.topClients = [...this.topClients]
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    //Calcular grafico de metodo de pago
    const total = cashCount + cardCount;
    this.paymentMethods = [{ method: 'Efectivo', value: (cashCount / total) * 100 },
      { method: 'Tarjeta', value: (cardCount / total) * 100 },]
  }

  initCharts() {
    // Destruir gráficos existentes
    if (this.categoryChart) this.categoryChart.destroy();
    if (this.weeklyTrendChart) this.weeklyTrendChart.destroy();
    if (this.monthlySalesChart) this.monthlySalesChart.destroy();
    if (this.paymentMethodChart) this.paymentMethodChart.destroy();
    if (this.topProductsChart) this.topProductsChart.destroy();

    // Gráfico circular: Categorías más vendidas
    const categoryCtx = document.getElementById('categoryChart') as HTMLCanvasElement;
    this.categoryChart = new Chart(categoryCtx, {
      type: 'pie',
      data: {
        labels: this.categorySales.map((cat) => cat.category),
        datasets: [
          {
            data: this.categorySales.map((cat) => cat.quantity),
            backgroundColor: this.generateRandomColors(this.categorySales.length),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    //Grafico de tendencia semanal
    const weeklyTrendCtx = document.getElementById('weeklyTrendChart') as HTMLCanvasElement;
    this.weeklyTrendChart = new Chart(weeklyTrendCtx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], // Etiquetas de días
        datasets: [
          {
            label: 'Ventas',
            data: this.weeklySales,
            borderColor: '#FF9800',
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#FF9800',
            pointBorderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false, // Ocultar la leyenda
          },
        },
        scales: {
          x: { display: true }, // Ocultar eje X
          y: { display: true }, // Ocultar eje Y
        },
      },
    });

    // Gráfico de barras: Ventas por mes
    const monthlySalesCtx = document.getElementById('monthlySalesChart') as HTMLCanvasElement;
    this.monthlySalesChart = new Chart(monthlySalesCtx, {
      type: 'bar',
      data: {
        labels: ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ag', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Ventas',
            data: this.salesByMonth.map((month) => month.total),
            backgroundColor: '#4CAF50',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mes',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Total (Q)',
            },
          },
        },
      },
    });

    //Gráfico de metodos de pago
    const paymentMethodCtx = document.getElementById('paymentMethodChart') as HTMLCanvasElement;
    this.paymentMethodChart = new Chart(paymentMethodCtx, {
      type: 'pie',
      data: {
        labels: this.paymentMethods.map((method) => method.method),
        datasets: [
          {
            data: this.paymentMethods.map((method) => method.value),
            backgroundColor: this.generateRandomColors(this.paymentMethods.length)
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
    

    // Gráfico de barras: Top 3 productos más vendidos
    const topProductsCtx = document.getElementById('topProductsChart') as HTMLCanvasElement;
    this.topProductsChart = new Chart(topProductsCtx, {
      type: 'doughnut',
      data: {
        labels: this.top3Products.map((product) => product.name),
        datasets: [
          {
            label: 'Cantidad vendida',
            data: this.top3Products.map((product) => product.quantity),
            backgroundColor: this.generateRandomColors(this.top3Products.length),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  // Genera una paleta de colores aleatorios
  generateRandomColors(count: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(this.getRandomColor());
    }
    return colors;
  }

  setLabelValue(value : string){
    if (value.length > 10) {
      return value.substring(0, 10) + '...';
    } else {
      return value;
    }
  }

}
