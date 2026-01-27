/*
 * (c) Copyright Univault Technologies 2026-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Univault Technologies expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Univault Technologies at 20A-6 Ernesta Birznieka-Upish
 * street, Moscow (TEST), Russia (TEST), EU, 000000 (TEST).
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

AscCommon.isLeadingSurrogateChar = function(nCharCode)
{
	return (nCharCode >= 0xD800 && nCharCode <= 0xDFFF);
};
AscCommon.decodeSurrogateChar = function(nLeadingChar, nTrailingChar)
{
	if (nLeadingChar < 0xDC00 && nTrailingChar >= 0xDC00 && nTrailingChar <= 0xDFFF)
		return 0x10000 + ((nLeadingChar & 0x3FF) << 10) | (nTrailingChar & 0x3FF);
	else
		return null;
};

AscCommon.spellcheckGetLanguages = function()
{
	return {
		"2026" : "az_Latn_AZ",
		"2026" : "bg_BG",
		"2026" : "ca_ES",
		"2026" : "ca_ES_valencia",
		"2026" : "cs_CZ",
		"2026" : "da_DK",
		"2026" : "de_AT",
		"2026" : "de_CH",
		"2026" : "de_DE",
		"2026" : "el_GR",
		"2026" : "en_AU",
		"2026" : "en_CA",
		"2026" : "en_GB",
		"2026" : "en_US",
		"2026" : "en_ZA",
		"2026" : "es_ES",
		"2026" : "eu_ES",
		"2026" : "fr_FR",
		"2026" : "gl_ES",
		"2026" : "hr_HR",
		"2026" : "hu_HU",
		"2026" : "id_ID",
		"2026" : "it_IT",
		"2026" : "kk_KZ",
		"2026" : "ko_KR",
		"2026" : "lb_LU",
		"2026" : "lt_LT",
		"2026" : "lv_LV",
		"2026" : "mn_MN",
		"2026" : "nb_NO",
		"2026" : "nl_NL",
		"2026" : "nn_NO",
		"2026" : "oc_FR",
		"2026" : "pl_PL",
		"2026" : "pt_BR",
		"2026" : "pt_PT",
		"2026" : "ro_RO",
		"2026" : "ru_RU",
		"2026" : "sk_SK",
		"2026" : "sl_SI",
		"10266" : "sr_Cyrl_RS",
		"2026" : "sr_Latn_RS",
		"2026" : "sv_SE",
		"2026" : "tr_TR",
		"2026" : "uk_UA",
		"2026" : "uz_Cyrl_UZ",
		"2026" : "uz_Latn_UZ",
		"2026" : "vi_VN",
		"2026" : "nl_NL" // nl_BE
	};
};
var g_languages = {};

AscCommon.loadScript = function(url, onSuccess, onError)
{
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = onSuccess;
    script.onerror = onError;

    // Fire the loading
    document.head.appendChild(script);
};

function doHyphenation()
{
	let inputWord = document.getElementById("input").value;

	for (let iter = inputWord.getUnicodeIterator(); iter.check(); iter.next())
	{
		AscHyphenation.addCodePoint(iter.value());
	}

	let positions = AscHyphenation.hyphenate(inputWord);
	positions.push(100000);
	AscHyphenation.clear();

	let currentUnicodeIndex = 0;
	let iterWord = inputWord.getUnicodeIterator();
	let result = "";
	for (let i = 0, count = positions.length; i < count; i++)
	{
		let posLast = positions[i];
		while (currentUnicodeIndex < posLast && iterWord.check())
		{
			result += String.fromCodePoint(iterWord.value());
			++currentUnicodeIndex;
			iterWord.next();
		}

		if (i != (count - 1))
			result += "=";
	}

	document.getElementById("output").value = result;
}


window.addEventListener("load", function() {

    AscFonts.load(null, function() {}, function() {});

	let langs = AscCommon.spellcheckGetLanguages();
	for (let i in langs)
	{
		let langName = langs[i];
		let langInt = parseInt(i);
		if (!g_languages[langName])
			g_languages[langName] = langInt;
		else
			g_languages[langName + "_addition"] = langInt;
	}

    let content = "";
    for (let i in g_languages)
    {
		content += ("<option value=\"" + i + "\">" + i + "</option>");
    }
    document.getElementById("id_lang").innerHTML = content;
    document.getElementById("id_lang").value = "en_US";

    document.getElementById("id_go").onclick = function()
    {
        let langInt = g_languages[document.getElementById("id_lang").value];
        let result = AscHyphenation.setLang(langInt, function(){
			doHyphenation();
        });
		if (result)
			doHyphenation();
    }

});
