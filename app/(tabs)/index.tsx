import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function HomeScreen() {
  const [consumo, setConsumo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [detalhes, setDetalhes] = useState([]);
  const [analise, setAnalise] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState(null);

  const screenWidth = Dimensions.get("window").width;

  function calcularConta(consumo) {
    let agua = 0;
    let esgoto = 0;
    let detalhes = [];

    function calcularFaixas(consumo) {
      let total = 0;
      let desc = [];

      if (consumo <= 10) {
        total = 40.42;
        desc.push(`Até 10 m³ = Taxa fixa R$ 40,42`);
      } else if (consumo <= 20) {
        const faixa1 = 40.42;
        const faixa2 = (consumo - 10) * 6.4;

        total = faixa1 + faixa2;

        desc.push(`Até 10 m³ = R$ 40,42`);
        desc.push(`${consumo - 10} m³ x R$ 6,40 = R$ ${faixa2.toFixed(2)}`);
      } else if (consumo <= 50) {
        const faixa1 = 40.42;
        const faixa2 = 10 * 6.4;
        const faixa3 = (consumo - 20) * 15.95;

        total = faixa1 + faixa2 + faixa3;

        desc.push(`Até 10 m³ = R$ 40,42`);
        desc.push(`10 m³ x R$ 6,40 = R$ ${faixa2.toFixed(2)}`);
        desc.push(`${consumo - 20} m³ x R$ 15,95 = R$ ${faixa3.toFixed(2)}`);
      } else {
        const faixa1 = 40.42;
        const faixa2 = 10 * 6.4;
        const faixa3 = 30 * 15.95;
        const faixa4 = (consumo - 50) * 17.57;

        total = faixa1 + faixa2 + faixa3 + faixa4;

        desc.push(`Até 10 m³ = R$ 40,42`);
        desc.push(`10 m³ x R$ 6,40 = R$ ${faixa2.toFixed(2)}`);
        desc.push(`30 m³ x R$ 15,95 = R$ ${faixa3.toFixed(2)}`);
        desc.push(`${consumo - 50} m³ x R$ 17,57 = R$ ${faixa4.toFixed(2)}`);
      }

      return { total, desc };
    }

    const aguaCalc = calcularFaixas(consumo);
    agua = aguaCalc.total;

    const esgotoCalc = calcularFaixas(consumo);
    esgoto = esgotoCalc.total;

    const taxaRegulacao = (agua + esgoto) * 0.005;

    detalhes.push("💧 Água:");
    detalhes.push(...aguaCalc.desc);
    detalhes.push(`Subtotal água: R$ ${agua.toFixed(2)}`);

    detalhes.push("");

    detalhes.push("🚽 Esgoto:");
    detalhes.push(...esgotoCalc.desc);
    detalhes.push(`Subtotal esgoto: R$ ${esgoto.toFixed(2)}`);

    detalhes.push("");

    detalhes.push(`Taxa de regulação (0,5%): R$ ${taxaRegulacao.toFixed(2)}`);

    const totalFinal = agua + esgoto + taxaRegulacao;

    return {
      total: totalFinal,
      detalhes,
    };
  }

  function analisarConsumo(consumo) {
    if (consumo <= 10) {
      return {
        mensagem: "Consumo muito bom! Continue assim 👏",
        dicas: [
          "Mantenha hábitos conscientes",
          "Continue monitorando seu consumo mensal",
        ],
      };
    } else if (consumo <= 20) {
      return {
        mensagem: "Consumo dentro do esperado 👍",
        dicas: [
          "Reduza o tempo de banho",
          "Feche a torneira ao escovar os dentes",
        ],
      };
    } else if (consumo <= 50) {
      return {
        mensagem: "Consumo elevado ⚠️",
        dicas: [
          "Verifique possíveis vazamentos",
          "Evite lavar calçada com mangueira",
          "Use balde ao invés de mangueira",
        ],
      };
    } else {
      return {
        mensagem: "Consumo muito alto 🚨",
        dicas: [
          "Verifique vazamentos URGENTE",
          "Reduza tempo de banho drasticamente",
          "Reutilize água sempre que possível",
        ],
      };
    }
  }

  function gerarDadosGrafico(consumo) {
    return {
      labels: ["Baixo", "Moderado", "Alto", "Seu consumo"],
      datasets: [
        {
          data: [10, 20, 50, consumo],
        },
      ],
    };
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>💧 Calculadora de Água</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Consumo (m³)</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: 15"
          keyboardType="numeric"
          value={consumo}
          onChangeText={setConsumo}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            const consumoNumero = parseFloat(consumo);

            if (!consumoNumero || consumoNumero <= 0) {
              setResultado("Digite um valor válido");
              setDetalhes([]);
              setAnalise(null);
              setDadosGrafico(null);
              return;
            }

            const { total, detalhes } = calcularConta(consumoNumero);

            setResultado(`R$ ${total.toFixed(2)}`);
            setDetalhes(detalhes);

            const analiseResultado = analisarConsumo(consumoNumero);
            setAnalise(analiseResultado);

            setDadosGrafico(gerarDadosGrafico(consumoNumero));
          }}
        >
          <Text style={styles.botaoTexto}>Calcular</Text>
        </TouchableOpacity>
      </View>

      {resultado && (
        <View style={styles.cardResultado}>
          <Text style={styles.resultadoLabel}>Valor total</Text>
          <Text style={styles.resultadoValor}>{resultado}</Text>
        </View>
      )}

      {analise && (
        <View style={styles.cardAnalise}>
          <Text style={styles.analiseTitulo}>Análise de consumo</Text>

          <Text style={styles.analiseMensagem}>{analise.mensagem}</Text>

          {analise.dicas.map((dica, index) => (
            <Text key={index} style={styles.dicaItem}>
              • {dica}
            </Text>
          ))}
        </View>
      )}

      {dadosGrafico && (
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Comparação de consumo</Text>

          <BarChart
            data={dadosGrafico}
            width={screenWidth - 40}
            height={220}
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: () => "#000",
            }}
            style={{
              borderRadius: 12,
            }}
          />
        </View>
      )}

      {detalhes.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Detalhamento</Text>

          {detalhes.map((item, index) => (
            <Text key={index} style={styles.detalheItem}>
              {item}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    color: "#007AFF",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardResultado: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  cardAnalise: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultadoLabel: {
    color: "#fff",
    fontSize: 16,
  },
  resultadoValor: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  analiseTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  analiseMensagem: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  dicaItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detalheItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});
