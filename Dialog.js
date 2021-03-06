const Dialog = {
	welcome: {
		TITLE: '歡迎您\n不管您想要申請免費試用體驗或是報名課程，都可以使用我們的 BOT 回答您的問題。現在麻煩您點選您需要的服務：',
		quick_replies: {
			trial: {
				TITLE: '申請免費試用皂'
			},
			wedding: {
				TITLE: '申請婚禮小物試用'
			},
			lecture: {
				TITLE: '報名體驗課程'
			},
			info: {
				TITLE: '暸解更多資訊'
			},
			collaborate: {
				TITLE: '企業合作'
			}
		}
	},
	trial: {
		TITLE: '「十克好朋友聯手出擊！」三三吾鄉捨棄大把買廣告的金錢，選擇使用免費試用皂與您相遇，接下來請您回答幾個基本資料問題，請務必輸入正確資料讓郵差能夠找到您：',
		thanks: {
			TITLE: '感謝您，恭喜申請成功，也歡迎您參考試用皂網頁，裡頭有更詳細的介紹！',
			URL: 'https://www.trisoap.com.tw/index.php?route=trial'
		}
	},
	wedding: {
		TITLE: '「您的婚禮，能傳遞平凡的幸福！」平均每一場婚禮可以讓 20 個身障學員有一週的工作量。歡迎您免費申請婚禮小物，接下來請您回答幾個基本資料問題，請務必輸入正確資料讓郵差能夠找到您：',
		thanks: {
			TITLE: '感謝您，恭喜申請成功，近日將會有專人與您聯繫，討論客製化合作以及時程。也歡迎您參考婚禮小物網頁，裡頭有更詳細的介紹！',
			URL: 'https://www.trisoap.com.tw/index.php?route=wedding'
		}
	},
	lecture: {
		TITLE: '「三三吾鄉體驗課，作出你專屬的皂！」三三吾鄉每個月在台北、宜蘭固定開設課程，有各式課程如婚禮小物體驗工作坊、小農米皂，甚至有高階技巧渲染皂，歡迎您留下訊息報名，我們將由專人詳細介紹課程資訊：',
		thanks: {
			TITLE: '感謝您，我們將盡最快速度與您聯繫，也歡迎您參考體驗式工作坊活動影片：',
			URL: 'https://www.facebook.com/trisoap/videos/1635375613227535/'
		}
	},
	info: {
		TITLE: '「快來成為下一個三粉！」三三吾鄉是一個愛搞怪的社會企業，常常有許多酷炫創新的活動。歡迎您更加了解我們，成為下一個三粉！',
		content: {
			TITLE: '更多資訊請見：\n或看看我們的形象影片！',
			button: {
				website: {
					TITLE: '官方網站',
					URL: 'https://www.trisoap.com.tw'
				},
				media: {
					TITLE: '媒體報導',
					URL: 'https://money.udn.com/money/story/6722/3193662'
				},
				interview: {
					TITLE: '國際專訪',
					URL: 'https://international.thenewslens.com/article/79925'
				}
			},
			video: {
				URL: 'https://www.facebook.com/trisoap/videos/1595275790570851/'
			},
		}
	},
	collaborate: {
		TITLE: '三三吾鄉企業合作案已累積數十間公司，不管是企業採購、演講邀約，只要您填寫您的公司、姓名、電話以及簡單的需求，我們都會由專人用最快的速度回覆您！'
	},
	image_url: {
		WELCOME: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Fwelcome.png?1535397196009',
		TRIAL: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Ftrial.png?1535397194558',
		WEDDING: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Fwedding.png?1535397195387',
		LECTURE: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Flecture.png?1535397196193',
		INFO: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Finfo.png?1535397193856',
		COLLABORATE: 'https://cdn.glitch.com/4ece6775-268d-427a-b285-803d4bc3a79c%2Fcollaborate.png?1535397195132'
	},
	ASK_FOR_NAME: '1. 請留下您的姓名（例如：王小明）',
	ASK_FOR_PHONE: '2. 接下來留下您的電話',
	ASK_FOR_ADDR: '3. 最後請輸入您完整的地址，請務必輸入正確資料讓郵差能夠找到您',
	FORWARD_TO_HUMAN_AGENT: '請稍等，將會有專人與您聯繫',
	WRONG_FORMAT: '您輸入的格式有誤，請重新輸入',
	getDialogByState: function(user) {
		switch(user.state) {
		case 'T':
			switch(user.step) {
			case 1:
				return Dialog.ASK_FOR_PHONE;
			case 2:
				return Dialog.ASK_FOR_ADDR;
			case 3:
				return `${Dialog.trial.thanks.TITLE}\n${Dialog.trial.thanks.URL}`;
			default:
				return Dialog.FORWARD_TO_HUMAN_AGENT;
			}
		case 'W':
			switch(user.step) {
			case 1:
				return Dialog.ASK_FOR_PHONE;
			case 2:
				return Dialog.ASK_FOR_ADDR;
			case 3:
				return `${Dialog.wedding.thanks.TITLE}\n${Dialog.wedding.thanks.URL}`;
			default:
				return Dialog.FORWARD_TO_HUMAN_AGENT;
			}
		case 'L':
			switch(user.step) {
			case 1:
				return Dialog.ASK_FOR_PHONE;
			case 2:
				return `${Dialog.lecture.thanks.TITLE}\n${Dialog.lecture.thanks.URL}`;
			default:
				return Dialog.FORWARD_TO_HUMAN_AGENT;
			}
		case 'I':
		case 'C':
		default:
			return Dialog.FORWARD_TO_HUMAN_AGENT;
		}
	}
};

module.exports = Dialog;
