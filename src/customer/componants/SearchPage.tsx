
import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";

interface Product {
  id: string | number;
  title?: string;
  slug?: string;
  category?: {
    categoryId: string;
  };
}

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  const navigate = useNavigate();

  //  SEARCH 
  const handleSearchDebounced = _.debounce(async (q: string) => {
    const keyword = q.trim();

    if (!keyword) {
      setResults([]);
      setNotFound(false);
      return;
    }

    try {
      const res = await axios.get<Product[]>(
        "http://localhost:5000/products/search",
        { params: { keyword } }
      );

      if (res.data?.length > 0) {
        setResults(res.data);
        setNotFound(false);
      } else {
        setResults([]);
        setNotFound(true);
      }
    } catch {
      setResults([]);
      setNotFound(true);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearchDebounced(value);
  };

  // STOP VOICE 
  const stopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    clearTimeout(silenceTimerRef.current);
  };

  //  START VOICE 
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; 
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const voiceText = event.results[event.results.length - 1][0].transcript;

      setQuery(voiceText);
      handleSearchDebounced(voiceText);

      //  reset silence timer
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopVoice();
      }, 5000); // 5 sec silence auto stop
    };

    recognition.onerror = () => {
      stopVoice();
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  //  TOGGLE 
  const toggleVoice = () => {
    if (listening) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  // HIGHLIGHT
  const highlightMatch = (text: string | undefined, q: string) => {
    if (!text) return "";
    if (!q) return text;

    const regex = new RegExp(`(${q})`, "gi");

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, "<b>$1</b>"),
        }}
      />
    );
  };

  const getSlug = (product: Product) => {
    return product.category?.categoryId || "";
  };

  return (
    <Box className="p-8 flex justify-center">
      <Paper elevation={3} sx={{ p: 4, width: 600 }}>
        <Typography align="center" variant="h6">
          Search Products
        </Typography>

        {/* SEARCH BOX */}
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            value={query}
            onChange={handleChange}
            fullWidth
            label="Search products"
          />

          {/* MIC */}
          <button
            onClick={toggleVoice}
            style={{
              marginLeft: "10px",
              background: listening ? "#ff4d4d" : "#f1f1f1",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "0.3s",
              animation: listening ? "pulse 1s infinite" : "none",
            }}
          >
            <KeyboardVoiceIcon />
          </button>
        </Box>

        {notFound && (
          <Typography color="error" mt={2} align="center">
            No products found
          </Typography>
        )}

        <List>
          {results.map((product) => (
            <ListItem key={product.id} disablePadding>
              <ListItemButton
                onClick={() =>
                  navigate(`/products/${getSlug(product)}`)
                }
              >
                {highlightMatch(product.title, query)}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* CSS ANIMATION */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </Paper>
    </Box>
  );
};

export default SearchPage;