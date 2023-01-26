export const BARCODE_SUB_KIND = {
    UPC_E: 'upce',
    CODE39: 'code39',
    CODE39_MOD43: 'code39_mod43',
    EAN13: 'ean13',
    EAN8: 'ean8',
    CODE128: 'code128',
    CODE93: 'code93',
    PDF_417: 'pdf_417',
    QR: 'qr',
    AZTEC: 'aztec',
};
  
export const BARCODE_LIB_RETURN_SUB_KIND = {
    UPC_E: Platform.OS === 'ios' ? 'org.gs1.UPC-E' : 'UPC_E',
    CODE39: Platform.OS === 'ios' ? 'org.iso.Code39' : 'CODE_39',
    CODE39_MOD43: Platform.OS === 'ios' ? 'org.iso.Code39' : 'CODE_39',
    EAN13: Platform.OS === 'ios' ? 'org.gs1.EAN-13' : 'EAN_13',
    EAN8: Platform.OS === 'ios' ? 'org.gs1.EAN-8' : 'EAN_8',
    CODE128: Platform.OS === 'ios' ? 'org.iso.Code128' : 'CODE_128',
    CODE93: Platform.OS === 'ios' ? 'com.intermec.Code93' : 'CODE_93',
    PDF_417: Platform.OS === 'ios' ? 'org.iso.PDF417' : 'PDF_417',
    QR: Platform.OS === 'ios' ? 'org.iso.QRCode' : 'QR_CODE',
    AZTEC: Platform.OS === 'ios' ? 'org.iso.Aztec' : 'AZTEC',
};

export function getBarcodeSubKind() {
    return BARCODE_SUB_KIND.UPC_E ? BARCODE_LIB_RETURN_SUB_KIND.UPC_E :
        BARCODE_SUB_KIND.CODE39 ? BARCODE_LIB_RETURN_SUB_KIND.CODE39 :
            BARCODE_SUB_KIND.CODE39_MOD43 ? BARCODE_LIB_RETURN_SUB_KIND.CODE39_MOD43 :
                BARCODE_SUB_KIND.EAN13 ? BARCODE_LIB_RETURN_SUB_KIND.EAN13 :
                    BARCODE_SUB_KIND.EAN8 ? BARCODE_LIB_RETURN_SUB_KIND.EAN8 :
                        BARCODE_SUB_KIND.CODE93 ? BARCODE_LIB_RETURN_SUB_KIND.CODE93 :
                            BARCODE_SUB_KIND.CODE128 ? BARCODE_LIB_RETURN_SUB_KIND.CODE128 :
                                BARCODE_SUB_KIND.PDF_417 ? BARCODE_LIB_RETURN_SUB_KIND.PDF_417 :
                                    BARCODE_SUB_KIND.QR ? BARCODE_LIB_RETURN_SUB_KIND.QR :
                                        BARCODE_SUB_KIND.AZTEC ? BARCODE_LIB_RETURN_SUB_KIND.AZTEC : ''
}
