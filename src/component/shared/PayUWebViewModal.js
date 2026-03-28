import React, { useState } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const PayUWebViewModal = ({ visible, payuPayload, onClose, onResult }) => {
  const [loading, setLoading] = useState(true);

  // 🧩 If payload is missing, don't render anything
  if (!payuPayload) return null;

  const {
    action,
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    phone,
    hash,
    udf1,
    surl,
    furl,
  } = payuPayload;

  // 🧾 Auto-submit HTML form (PayU POST)
  const html = `
    <html>
      <body onload="document.forms[0].submit();">
        <form method="post" action="${action}">
          <input type="hidden" name="key" value="${key}" />
          <input type="hidden" name="txnid" value="${txnid}" />
          <input type="hidden" name="amount" value="${amount}" />
          <input type="hidden" name="productinfo" value="${productinfo}" />
          <input type="hidden" name="firstname" value="${firstname}" />
          <input type="hidden" name="email" value="${email}" />
          <input type="hidden" name="phone" value="${phone}" />
          <input type="hidden" name="surl" value="${surl}" />
          <input type="hidden" name="furl" value="${furl}" />
          <input type="hidden" name="hash" value="${hash}" />
        </form>
      </body>
    </html>
  `;

  // 🧭 Handle PayU redirects
  const handleNavChange = (navState) => {
    const url = navState.url;

    // 🟢 Payment Success
    if (url.startsWith(surl)) {
      console.log("✅ Payment success redirect detected:", url);
      onResult("success");
      return;
    }

    // 🔴 Payment Failure
    if (url.startsWith(furl)) {
      console.log("❌ Payment failure redirect detected:", url);
      onResult("failure");
      return;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}

        <WebView
          originWhitelist={["*"]}
          source={{ html, baseUrl: "" }}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={handleNavChange}
          javaScriptEnabled
          domStorageEnabled
          onShouldStartLoadWithRequest={(request) => {
            const { url } = request;

            // 🟢 Detect UPI Deep Links (Intent)
            if (url.startsWith("upi://") || url.startsWith("intent://")) {
              console.log("📲 Launching UPI app with URL:", url);

              Linking.openURL(url).catch(() => {
                Alert.alert(
                  "UPI App Not Found",
                  "Please install Google Pay, PhonePe, or Paytm to complete the payment."
                );
              });

              return false; // stop WebView from loading it
            }

            // 🟢 Detect success/failure manually as a backup
            if (url.startsWith(surl)) {
              onResult("success");
              onClose();
              return false;
            }
            if (url.startsWith(furl)) {
              onResult("failure");
              onClose();
              return false;
            }

            return true; // allow all other URLs
          }}
          onError={(err) =>
            console.warn("WebView error:", err.nativeEvent.description)
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});

export default PayUWebViewModal;
