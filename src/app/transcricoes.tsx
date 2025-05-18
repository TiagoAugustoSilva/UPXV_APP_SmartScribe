import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";

export default function Transcricoes() {
  const [files, setFiles] = useState<{ uri: string; name: string; content: string }[]>([]);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const isFocused = useIsFocused();

  const loadFiles = async () => {
    const dirUri = FileSystem.documentDirectory + "transcricoes/";

    try {
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
        setFiles([]);
        return;
      }

      const fileNames = await FileSystem.readDirectoryAsync(dirUri);

      const filesData = await Promise.all(
        fileNames.map(async (fileName) => {
          const uri = dirUri + fileName;
          const content = await FileSystem.readAsStringAsync(uri);
          return { uri, name: fileName, content };
        })
      );

      setFiles(filesData);
    } catch (error) {
      console.error("Erro ao carregar transcrições:", error);
      setFiles([]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadFiles();
    }
  }, [isFocused]);

  const handleDelete = (fileUri: string) => {
    Alert.alert(
      "Excluir Transcrição",
      "Tem certeza que deseja excluir esta transcrição?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(fileUri);
              // Se o conteúdo exibido for o arquivo deletado, fechar o modal
              if (selectedContent && files.find(f => f.uri === fileUri)?.content === selectedContent) {
                setSelectedContent(null);
              }
              loadFiles();
            } catch (error) {
              console.error("Erro ao excluir arquivo:", error);
              Alert.alert("Erro", "Não foi possível excluir a transcrição.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transcrições Salvas</Text>

      {files.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma transcrição salva.</Text>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity style={styles.item} onPress={() => setSelectedContent(item.content)}>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.uri)}>
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {selectedContent && (
        <View style={styles.contentContainer}>
          <ScrollView>
            <Text style={styles.contentText}>{selectedContent}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedContent(null)}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  emptyText: { fontStyle: "italic", fontSize: 18, color: "#666", textAlign: "center", marginTop: 40 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  item: { flex: 1, padding: 15 },
  itemText: { fontSize: 18, color: "#007AFF" },
  deleteButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginRight: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  contentContainer: {
    marginTop: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    maxHeight: "50%",
    padding: 10,
  },
  contentText: { fontSize: 16, color: "#333" },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "#fff", fontWeight: "bold" },
});
