<template>
    <select @change="componentUpdated" class="selectpicker" v-model="selectedFont">
        <option value="" :data-content="'<span>Default</span>'">Default</option>
        <option v-for="font in customFonts" :value="font" :data-content="'<span style=\'font-family: ' + font + '\'>' + font + '</span>'">{{ font }}</option>
        <option v-for="font in standardFonts" :value="font" :data-content="'<span style=\'font-family: ' + font + '\'>' + font + '</span>'">{{ font }}</option>
    </select>
</template>

<script>
/* globals WebFont */
export default {
    components: {},
    data() {
        return {
            selectedFont: this.styleValue.value.fontFamily
        }
    },
    mounted() {
        $('select.selectpicker').selectpicker()
        var googleFontFamilies = []
        this.styleValue.style.fonts.forEach(function(font) {
            if (font.type === 'google') {
                googleFontFamilies.push(font.name)
            }
        })
        if (WebFont && googleFontFamilies.length) {
            WebFont.load({
                google: {
                    families: googleFontFamilies
                }
            })
        }
    },
    methods: {
        componentUpdated: function () {
            this.$emit('update', {
                variable: this.styleValue.style.variable,
                value: {
                    fontFamily: this.selectedFont
                }
            })
        }
    },
    computed: {
        customFonts: function() {
            var fonts = []
            var my = this
            this.styleValue.style.fonts.forEach(function(font) {
                fonts.push(font.name)
            })
            if (fonts.indexOf(my.selectedFont) === -1 && my.standardFonts.indexOf(my.selectedFont) === -1) {
                fonts.push(my.selectedFont)
            }
            return fonts
        },
        standardFonts: function () {
            return [
                'Helvetica',
                'Arial',
                'Arial Black',
                'Verdana',
                'Tahoma',
                'Trebuchet MS',
                'Impact',
                'Times New Roman',
                'Didot',
                'Georgia',
                'Garamond',
                'American Typewriter',
                'Andale Mono',
                'Courier New',
                'Lucida Console',
                'Monaco',
                'Brush Script MT'
            ]
        }
    },
    props: {
        styleValue: {
            type: Object
        }
    }
}
</script>
