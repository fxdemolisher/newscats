import React from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import {connect} from 'react-redux'

import {Images} from '/images'
import {Styles} from '/styles'
import {BaseComponent, ImageButton} from '/widgets'

import {Feed} from './feed'

const styles = {
    container: {
        backgroundColor: Styles.Color.Grey300,
        height: '100%',
        width: '100%',
    },
    empty: {
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.4,
        justifyContent: 'flex-end',
        paddingHorizontal: Styles.Size.Medium,
    },
    emptyText: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey500,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Medium,
        textAlign: 'center',
    },
    filterPickerDropdown: {
        backgroundColor: Styles.Color.White,
        borderRadius: 4,
        elevation: 4,
        flex: 0,
        shadowColor: Styles.Color.Black,
        shadowOffset: {
            height: 4,
            width: 0,
        },
        shadowOpacity: 0.3,
    },
    filterPickerText: {
        backgroundColor: Styles.Color.Clear,
        color: Styles.Color.Grey700,
        fontFamily: Styles.Font.Family.RobotoRegular,
        fontSize: Styles.Font.Size.Small,
        padding: Styles.Size.XSmall,
    },
}

const stylesheet = StyleSheet.create(styles)

/**
 * Component holding hte favorites pack title filter dropdown.
 */
class FavoritesFilter extends BaseComponent {
    constructor(props) {
        super(props)

        this.selectedFilter = 'All'
        this.refreshOptions(this.props.favorites)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.favorites != nextProps.favorites) {
            this.refreshOptions(nextProps.favorites)
        }
    }

    refreshOptions(favorites) {
        const packTitleCounts = {}
        Object.values(this.props.favorites).forEach((item) => {
            let packTitle = item.packTitle
            if (!packTitle) {
                packTitle = 'Other'
            }

            packTitleCounts[packTitle] = (packTitleCounts[packTitle] || 0) + 1
        })

        const sortedTitles = Object.keys(packTitleCounts).sort()
        const allTitles = ['All'].concat(sortedTitles)

        const options = []
        const optionToFilterValueMap = {}
        allTitles.forEach((title) => {
            const count = (packTitleCounts[title] || 0)
            const option = title + (count > 0 ? (' (' + count + ')') : '')

            options.push(option)
            optionToFilterValueMap[option] = title
        })

        this.options = options
        this.optionToFilterValueMap = optionToFilterValueMap
    }

    onFilterSelected = (index, option) => {
        const newFilter = this.optionToFilterValueMap[option]
        if (newFilter != this.selectedFilter) {
            this.selectedFilter = newFilter
            this.props.navigation.setParams({ filter: newFilter })
        }

        return true
    }

    showModal = () => {
        if (!this.modal) {
            return
        }

        this.modal.show()
    }

    render() {
        if (this.options.length < 3) {
            return null
        }

        return (
            <ModalDropdown defaultIndex={0}
                           dropdownStyle={stylesheet.filterPickerDropdown}
                           dropdownTextStyle={stylesheet.filterPickerText}
                           dropdownTextHighlightStyle={[stylesheet.filterPickerText, { fontWeight: 'bold' }]}
                           onSelect={this.onFilterSelected}
                           options={this.options}
                           ref={(ref) => { this.modal = ref }}
                           renderSeparator={() => (null)} >

                <ImageButton imageSource={Images.filter}
                             onPress={this.showModal} />

            </ModalDropdown>
        )
    }
}

FavoritesFilter = connect((state) => ({ favorites: state.favorites }))(FavoritesFilter)

/**
 * A screen used to show a feed of favorite items.
 */
class FavoritesScreen extends BaseComponent {
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {}
        let title = 'Favorites'
        if (params.count) {
            if (params.count > 1) {
                title = params.count + ' ' + title
            } else if (params.count == 1) {
                title = params.count + ' Favorite'
            }
        }

        return {
            title: title,
            headerRight: (<FavoritesFilter navigation={navigation} />),
        }
    }
    componentWillMount() {
        this.refreshCount(Object.keys(this.props.favorites).length, null)
    }

    componentWillReceiveProps(nextProps) {
        const count = Object.keys(nextProps.favorites).length
        const previousCount = Object.keys(this.props.favorites).length
        this.refreshCount(count, previousCount)
    }

    refreshCount(count, previousCount) {
        if (count != previousCount) {
            this.props.navigation.setParams({ count: count })
        }
    }

    render() {
        const params = this.props.navigation.state.params
        const filter = (params ? params.filter : null)

        console.log("@@@", params, filter)

        const favorites = Object.values(this.props.favorites)
            .sort((left, right) => {
                if (left.timestamp.isBefore(right.timestamp)) {
                    return 1
                }

                if (left.timestamp.isAfter(right.timestamp)) {
                    return -1
                }

                return 0
            })
            .filter((item) => {
                if (!filter || filter == 'All') {
                    return true
                }

                if (!item.packTitle && filter == 'Other') {
                    return true
                }

                return item.packTitle == filter
            })

        const empty = (
            <View style={stylesheet.empty}>
                <Text style={stylesheet.emptyText}>
                    Your favorites cats will appear here.
                </Text>
            </View>
        )

        return (
            <View style={stylesheet.container}>
                <Feed empty={empty}
                      contents={favorites} />
            </View>
        )
    }
}

FavoritesScreen = connect((state) => ({ favorites: state.favorites }))(FavoritesScreen)

export {
    FavoritesScreen,
}
